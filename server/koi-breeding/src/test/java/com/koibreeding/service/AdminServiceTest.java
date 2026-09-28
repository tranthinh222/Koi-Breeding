package com.koibreeding.service;

import com.koibreeding.domain.User;
import com.koibreeding.dto.request.AdminModerationUserRequest;
import com.koibreeding.enums.Role;
import com.koibreeding.enums.UserStatus;
import com.koibreeding.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {
    @Mock private UserRepository userRepository;
    @Mock private UserService userService;
    @Mock private AdminMailService adminMailService;
    @InjectMocks private AdminService service;

    @AfterEach void clearAuthentication() { SecurityContextHolder.clearContext(); }

    private void signIn(Role role) {
        User actor = new User();
        actor.setRole(role);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("manager", null, List.of()));
        when(userRepository.findByUsername("manager")).thenReturn(Optional.of(actor));
    }

    private User target(Role role, UserStatus status) {
        User user = new User();
        user.setId(2);
        user.setRole(role);
        user.setStatus(status);
        when(userRepository.findById(2)).thenReturn(Optional.of(user));
        return user;
    }

    @ParameterizedTest
    @EnumSource(value = Role.class, names = {"ADMIN", "SUPER_ADMIN"})
    void listIsFilteredBeforePagination(Role role) {
        signIn(role);
        var roles = role == Role.SUPER_ADMIN ? List.of(Role.USER, Role.ADMIN) : List.of(Role.USER);
        var pageable = PageRequest.of(0, 10);
        when(userRepository.searchManagedUsers(eq(roles), isNull(), isNull(), isNull(), isNull(), isNull(), any())).thenReturn(new PageImpl<>(List.of(), pageable, 0));
        assertEquals(0, service.handleFetchAllUsers(pageable).getMeta().getTotalElements());
        verify(userRepository).searchManagedUsers(eq(roles), isNull(), isNull(), isNull(), isNull(), isNull(), any());
    }

    @ParameterizedTest
    @EnumSource(value = Role.class, names = {"ADMIN", "SUPER_ADMIN"})
    void adminCannotManagePrivilegedAccounts(Role role) {
        signIn(Role.ADMIN);
        target(role, UserStatus.DELETED);
        var request = new AdminModerationUserRequest();
        request.setId(2);
        request.setStatus(UserStatus.ACTIVE);
        request.setReason("Restore account");
        assertEquals(HttpStatus.FORBIDDEN, assertThrows(ResponseStatusException.class,
                () -> service.handleUpdateUser(request)).getStatusCode());
        assertEquals(HttpStatus.FORBIDDEN, assertThrows(ResponseStatusException.class,
                () -> service.handleDeleteUser(2)).getStatusCode());
        verify(userRepository, never()).save(any());
        verify(userRepository, never()).delete(any());
        verifyNoInteractions(adminMailService);
    }

    @ParameterizedTest
    @EnumSource(value = Role.class, names = {"USER", "ADMIN"})
    void superAdminCanBanAndDeleteManagedAccounts(Role role) {
        signIn(Role.SUPER_ADMIN);
        User user = target(role, UserStatus.ACTIVE);
        var request = new AdminModerationUserRequest();
        request.setId(2);
        request.setStatus(UserStatus.BANNED);
        request.setReason("Violation");
        service.handleUpdateUser(request);
        assertEquals(UserStatus.BANNED, user.getStatus());
        assertTrue(user.getIsBanned());
        verify(userRepository).save(user);
        verify(adminMailService).sendStatusChangedMail(user, UserStatus.BANNED, "Violation");
        user.setStatus(UserStatus.DELETED);
        service.handleDeleteUser(2);
        verify(userRepository).delete(user);
    }

    @Test void superAdminCannotManageAnotherSuperAdmin() {
        signIn(Role.SUPER_ADMIN);
        target(Role.SUPER_ADMIN, UserStatus.DELETED);
        var request = new AdminModerationUserRequest();
        request.setId(2);
        assertThrows(ResponseStatusException.class, () -> service.handleUpdateUser(request));
        assertThrows(ResponseStatusException.class, () -> service.handleDeleteUser(2));
        verify(userRepository, never()).save(any());
        verify(userRepository, never()).delete(any());
    }

    @Test void adminCannotChangeRoles() {
        signIn(Role.ADMIN);
        assertThrows(ResponseStatusException.class, () -> service.handleUpdateUserRole(2, Role.ADMIN));
        verify(userRepository, never()).save(any());
    }

    @Test void adminCanModerateOrdinaryUser() {
        signIn(Role.ADMIN);
        User user = target(Role.USER, UserStatus.ACTIVE);
        var request = new AdminModerationUserRequest();
        request.setId(2);
        request.setStatus(UserStatus.DELETED);
        service.handleUpdateUser(request);
        assertEquals(UserStatus.DELETED, user.getStatus());
        verify(userRepository).save(user);
    }

    @Test void superAdminCanDemoteAdmin() {
        signIn(Role.SUPER_ADMIN);
        User user = target(Role.ADMIN, UserStatus.ACTIVE);
        service.handleUpdateUserRole(2, Role.USER);
        assertEquals(Role.USER, user.getRole());
        verify(userRepository).save(user);
    }

    @Test void searchCombinesFiltersAndKeepsAdminScopeWithStableSorting() {
        signIn(Role.ADMIN);
        var pageable = PageRequest.of(1, 8, org.springframework.data.domain.Sort.by("level").descending());
        var sorted = PageRequest.of(1, 8, pageable.getSort().and(org.springframework.data.domain.Sort.by("id")));
        when(userRepository.searchManagedUsers(List.of(Role.USER), "%alice!_!%%",
                com.koibreeding.enums.Gender.FEMALE, Role.ADMIN, UserStatus.ACTIVE,
                com.koibreeding.enums.Location.HANOI, sorted))
                .thenReturn(new PageImpl<>(List.of(), sorted, 0));
        service.handleFetchAllUsers(pageable, " Alice_% ", com.koibreeding.enums.Gender.FEMALE,
                Role.ADMIN, UserStatus.ACTIVE, com.koibreeding.enums.Location.HANOI);
        verify(userRepository).searchManagedUsers(List.of(Role.USER), "%alice!_!%%",
                com.koibreeding.enums.Gender.FEMALE, Role.ADMIN, UserStatus.ACTIVE,
                com.koibreeding.enums.Location.HANOI, sorted);
    }

    @Test void unsupportedSortIsRejected() {
        var pageable = PageRequest.of(0, 8, org.springframework.data.domain.Sort.by("password"));
        assertEquals(HttpStatus.BAD_REQUEST, assertThrows(ResponseStatusException.class,
                () -> service.handleFetchAllUsers(pageable)).getStatusCode());
        verifyNoInteractions(userRepository);
    }

    @Test void ordinaryUserCannotListAccounts() {
        signIn(Role.USER);
        assertThrows(ResponseStatusException.class, () -> service.handleFetchAllUsers(PageRequest.of(0, 10)));
        verify(userRepository, never()).searchManagedUsers(any(), any(), any(), any(), any(), any(), any());
    }
}
