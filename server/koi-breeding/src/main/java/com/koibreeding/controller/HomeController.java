package com.koibreeding.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.koibreeding.domain.response.home.HomeResponse;
import com.koibreeding.service.HomeService;

@RestController
@RequestMapping("/api/v1")
public class HomeController {
    private final HomeService homeService;

    public HomeController(HomeService homeService){
        this.homeService = homeService;
    }

    @GetMapping("/home")
    public ResponseEntity<HomeResponse> getHome(){
        HomeResponse response = homeService.getHome();

        return ResponseEntity.ok(response);
    }
}
