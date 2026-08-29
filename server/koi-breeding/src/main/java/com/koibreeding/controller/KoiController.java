package com.koibreeding.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.koibreeding.domain.Koi;
import com.koibreeding.dto.request.RequestMoveKoiDTO;
import com.koibreeding.dto.request.RequestReleaseKoiDTO;
import com.koibreeding.dto.response.ResKoiDTO;
import com.koibreeding.service.KoiService;

@RestController
@RequestMapping("/api/v1")
public class KoiController {
    private final KoiService koiService;

    public KoiController(KoiService koiService) {
        this.koiService = koiService;
    }

    @PostMapping("/kois")
    public ResponseEntity<Koi> createNewKoi(@RequestBody Koi koi) {
        Koi newKoi = this.koiService.handleCreateKoi(koi);

        return ResponseEntity.status(HttpStatus.CREATED).body(newKoi);
    }

    @PostMapping("/kois/import")
    public ResponseEntity<List<ResKoiDTO>> releaseKoisToPond(@RequestBody RequestReleaseKoiDTO requestReleaseKoiDTO)
            throws Exception {
        List<ResKoiDTO> newKoiList = this.koiService.handleReleaseKoi(requestReleaseKoiDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(newKoiList);
    }

    @PostMapping("/kois/move")
    public ResponseEntity<ResKoiDTO> moveKoiToNewPond(@RequestBody RequestMoveKoiDTO requestMoveKoiDTO)
            throws Exception {
        ResKoiDTO updatedKoi = this.koiService.handleMoveKoi(requestMoveKoiDTO);
        return ResponseEntity.ok(updatedKoi);
    }

    @PutMapping("/kois")
    public ResponseEntity<Koi> updateAKoi(@RequestBody Koi koi) throws Exception {
        if (koiService.isKoiExistById(koi.getId())) {
            throw new Exception("Koi with id '" + koi.getId() + "' is not exist.");
        }

        Koi updatedKoi = this.koiService.handleUpdateKoi(koi);

        return ResponseEntity.ok(updatedKoi);
    }

    @GetMapping("/kois/{id}")
    public ResponseEntity<Koi> getKoiById(@PathVariable Integer id) throws Exception {
        Koi fetchedKoi = koiService.handleFetchKoiById(id);
        if (fetchedKoi == null) {
            throw new Exception("Koi with id '" + id + "' is not exist.");
        }

        return ResponseEntity.ok(fetchedKoi);
    }

    @GetMapping("/kois")
    public ResponseEntity<List<ResKoiDTO>> getAllKoisInPond(@RequestParam Integer pondId) {
        List<ResKoiDTO> koiList = koiService.handleFetchAllKoisInPond(pondId);

        return ResponseEntity.ok(koiList);
    }

    @DeleteMapping("/kois/{id}")
    public ResponseEntity<Void> deleteKoi(@PathVariable Integer id) throws Exception {
        if (!koiService.isKoiExistById(id)) {
            throw new Exception("Koi with id '" + id + "' is not exist.");
        }

        this.koiService.handleDeleteKoi(id);

        return ResponseEntity.ok().build();
    }
}
