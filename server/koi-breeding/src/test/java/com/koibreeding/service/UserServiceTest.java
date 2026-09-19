package com.koibreeding.service;

import com.koibreeding.domain.User;
import com.koibreeding.dto.response.ResUserDto;
import com.koibreeding.enums.Gender;
import com.koibreeding.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private com.koibreeding.repository.KoiRepository koiRepository;
    @Mock
    private com.koibreeding.repository.TransactionRepository transactionRepository;

    @InjectMocks
    private UserService userService;

    private ResUserDto resUserDto;
    private User user;
    @BeforeEach
    void initData(){
        user = new User();
        user.setId(1);

        resUserDto = new ResUserDto();
        resUserDto.setId(1);
        resUserDto.setUsername("khoa");
        resUserDto.setEmail("khoa@gmail.com");
        resUserDto.setBirthday(LocalDate.of(1999,5,13));
        resUserDto.setGender(Gender.MALE);
        resUserDto.setAvatarUrl("1234567");
        resUserDto.setLevel(100);
    }
    @Test
    void convertToResUserDto_success(){
        //WHEN + THEN
        ResUserDto result = userService.convertToResUserDto(user);

        assertEquals(user.getUsername(), result.getUsername());
        assertEquals(user.getEmail(), result.getEmail());
        assertEquals(user.getBirthday(), result.getBirthday());
        assertEquals(user.getGender(), result.getGender());
        assertEquals(user.getAvatarUrl(), result.getAvatarUrl());
        assertEquals(user.getLevel(), result.getLevel());
        assertEquals(0, result.getTotalFish());
        assertEquals(0, result.getMarketplaceSales());
        assertEquals(java.util.List.of(), result.getMostBeautifulKoi());
    }

    @Test
    void profileStatsCountOwnedFishAndSellFishTransactions() {
        when(koiRepository.countByPond_Owner_Id(1)).thenReturn(12L);
        when(transactionRepository.countByWalletUserIdAndTransactionType(
                1, com.koibreeding.enums.TransactionType.SELL_FISH)).thenReturn(7L);

        ResUserDto result = userService.convertToResUserDto(user);

        assertEquals(12, result.getTotalFish());
        assertEquals(7, result.getMarketplaceSales());
    }

    @Test
    void profileReturnsTopKoiNamesImagesAndScoresFromDatabase() {
        var koi = org.mockito.Mockito.mock(com.koibreeding.repository.KoiRepository.BeautifulKoiView.class);
        when(koi.getId()).thenReturn(42);
        when(koi.getName()).thenReturn("Sakura");
        when(koi.getImageUrl()).thenReturn("/kois/sakura.svg");
        when(koi.getBeautifulScore()).thenReturn(91.25);
        when(koiRepository.findMostBeautifulByOwner(1, org.springframework.data.domain.PageRequest.of(0, 3)))
                .thenReturn(java.util.List.of(koi));

        var result = userService.convertToResUserDto(user).getMostBeautifulKoi();

        assertEquals(1, result.size());
        assertEquals(42, result.get(0).id());
        assertEquals("Sakura", result.get(0).name());
        assertEquals("/kois/sakura.svg", result.get(0).imageUrl());
        assertEquals(91.25, result.get(0).beautifulScore());
    }
    @org.junit.jupiter.params.ParameterizedTest
    @org.junit.jupiter.params.provider.EnumSource(value = com.koibreeding.enums.Role.class, names = {"ADMIN", "SUPER_ADMIN"})
    void adminUsernameCannotBeChanged(com.koibreeding.enums.Role role) {
        user.setRole(role);
        user.setUsername("admin");
        when(userRepository.findById(1)).thenReturn(java.util.Optional.of(user));
        User changes = new User();
        changes.setUsername("renamed");
        org.junit.jupiter.api.Assertions.assertThrows(org.springframework.web.server.ResponseStatusException.class,
                () -> userService.handleUpdateProfile(1, changes));
        assertEquals("admin", user.getUsername());
        org.mockito.Mockito.verify(userRepository, org.mockito.Mockito.never()).save(org.mockito.ArgumentMatchers.any());
    }

    @Test void duplicateEmailRejectsProfileWithoutSaving() {
        user.setEmail("original@example.com");
        when(userRepository.findById(1)).thenReturn(java.util.Optional.of(user));
        when(userRepository.existsByEmailIgnoreCaseAndIdNot("Taken@Example.com", 1)).thenReturn(true);
        User changes = new User();
        changes.setEmail(" Taken@Example.com ");
        var error = org.junit.jupiter.api.Assertions.assertThrows(org.springframework.web.server.ResponseStatusException.class,
                () -> userService.handleUpdateProfile(1, changes));
        assertEquals(org.springframework.http.HttpStatus.CONFLICT, error.getStatusCode());
        assertEquals("original@example.com", user.getEmail());
        org.mockito.Mockito.verify(userRepository, org.mockito.Mockito.never()).save(org.mockito.ArgumentMatchers.any());
    }

    @Test void ownEmailCanBeSavedAndAdminUsernameStaysUnchanged() {
        user.setRole(com.koibreeding.enums.Role.ADMIN);
        user.setUsername("admin");
        user.setEmail("admin@example.com");
        when(userRepository.findById(1)).thenReturn(java.util.Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);
        User changes = new User();
        changes.setEmail(" admin@example.com ");
        changes.setGender(Gender.FEMALE);
        var result = userService.handleUpdateProfile(1, changes);
        assertEquals("admin", result.getUsername());
        assertEquals("admin@example.com", result.getEmail());
        assertEquals(Gender.FEMALE, result.getGender());
        org.mockito.Mockito.verify(userRepository).existsByEmailIgnoreCaseAndIdNot("admin@example.com", 1);
    }
}
