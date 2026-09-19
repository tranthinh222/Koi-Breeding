package com.koibreeding.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.koibreeding.domain.Koi;
import com.koibreeding.dto.request.RequestFeedKoiDTO;
import com.koibreeding.dto.request.RequestHealKoiDTO;
import com.koibreeding.dto.request.RequestMoveKoiDTO;
import com.koibreeding.dto.request.RequestReleaseKoiDTO;
import com.koibreeding.dto.response.ResFeedKoiDTO;
import com.koibreeding.dto.response.ResHealKoiDTO;
import com.koibreeding.dto.response.ResKoiDTO;
import com.koibreeding.repository.UserRepository;
import com.koibreeding.service.KoiService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class KoiController {
    private final KoiService koiService;
    private final UserRepository userRepository;

    public KoiController(KoiService koiService, UserRepository userRepository) {
        this.koiService = koiService;
        this.userRepository = userRepository;
    }

    @PostMapping("/kois")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Koi> createNewKoi(@RequestBody Koi koi) {
        Koi newKoi = this.koiService.handleCreateKoi(koi);

        return ResponseEntity.status(HttpStatus.CREATED).body(newKoi);
    }

    @PostMapping("/kois/import")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ResKoiDTO>> releaseKoisToPond(@RequestBody RequestReleaseKoiDTO requestReleaseKoiDTO)
            throws Exception {
        List<ResKoiDTO> newKoiList = this.koiService.handleReleaseKoi(requestReleaseKoiDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(newKoiList);
    }

    @PostMapping("/kois/move")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ResKoiDTO> moveKoiToNewPond(@RequestBody RequestMoveKoiDTO requestMoveKoiDTO)
            throws Exception {
        ResKoiDTO updatedKoi = this.koiService.handleMoveKoi(requestMoveKoiDTO);
        return ResponseEntity.ok(updatedKoi);
    }

    @PostMapping("/kois/{koiId}/feed")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ResFeedKoiDTO> feedKoi(
            @PathVariable Integer koiId,
            @Valid @RequestBody RequestFeedKoiDTO request) {
        return ResponseEntity.ok(this.koiService.handleFeedKoi(koiId, request));
    }

    @PostMapping("/kois/{koiId}/heal")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ResHealKoiDTO> healKoi(@PathVariable Integer koiId,
            @Valid @RequestBody RequestHealKoiDTO request, Principal principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please sign in to use medicine.");
        }
        // JWT authentication currently exposes the username; resolve it to a trusted
        // user ID.
        Integer authenticatedUserId = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found."))
                .getId();
        if (!authenticatedUserId.equals(request.userId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot use another user's inventory.");
        }
        return ResponseEntity.ok(koiService.handleHealKoi(koiId, request));
    }

    @PutMapping("/kois")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Koi> updateAKoi(@RequestBody Koi koi) throws Exception {
        if (koiService.isKoiExistById(koi.getId())) {
            throw new RuntimeException("Koi with id '" + koi.getId() + "' is not exist.");
        }

        Koi updatedKoi = this.koiService.handleUpdateKoi(koi);

        return ResponseEntity.ok(updatedKoi);
    }

    @GetMapping("/kois/{id}/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ResKoiDTO> getOwnedProfile(@PathVariable Integer id, Principal principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please sign in to view koi profiles.");
        }
        Integer userId = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found."))
                .getId();
        return ResponseEntity.ok(koiService.fetchOwnedProfile(id, userId));
    }

    @GetMapping("/kois/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Koi> getKoiById(@PathVariable Integer id) throws Exception {
        Koi fetchedKoi = koiService.handleFetchKoiById(id);
        if (fetchedKoi == null) {
            throw new RuntimeException("Koi with id '" + id + "' is not exist.");
        }

        return ResponseEntity.ok(fetchedKoi);
    }

    @GetMapping("/kois")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ResKoiDTO>> getAllKoisInPond(@RequestParam Integer pondId) {
        List<ResKoiDTO> koiList = koiService.handleFetchAllKoisInPond(pondId);

        return ResponseEntity.ok(koiList);
    }

    @DeleteMapping("/kois/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteKoi(@PathVariable Integer id) throws Exception {
        if (!koiService.isKoiExistById(id)) {
            throw new RuntimeException("Koi with id '" + id + "' is not exist.");
        }

        this.koiService.handleDeleteKoi(id);

        return ResponseEntity.ok().build();
    }
}
