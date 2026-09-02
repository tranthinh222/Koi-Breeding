//package com.koibreeding.service;
//
//import com.koibreeding.domain.*;
//import com.koibreeding.dto.request.*;
//import com.koibreeding.dto.response.ResMarketDto;
//import com.koibreeding.dto.response.ResTradeDto;
//import com.koibreeding.enums.Gender;
//import com.koibreeding.repository.KoiRepository;
//import com.koibreeding.repository.MarketRepository;
//import com.koibreeding.repository.PondRepository;
//import com.koibreeding.repository.UserRepository;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.ArgumentCaptor;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.data.jpa.domain.Specification;
//
//import java.math.BigDecimal;
//import java.time.OffsetDateTime;
//import java.util.List;
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.*;
//import static org.mockito.Mockito.*;
//
//@ExtendWith(MockitoExtension.class)
//public class MarketServiceTest {
//
//    @Mock
//    private MarketRepository marketRepository;
//
//    @Mock
//    private KoiRepository koiRepository;
//
//    @Mock
//    private WalletService walletService;
//
//    @Mock
//    private UserRepository userRepository;
//
//    @Mock
//    private PondRepository pondRepository;
//
//    @InjectMocks
//    private MarketService marketService;
//
//    private User seller;
//    private User buyer;
//    private Koi koi;
//    private Koi koi2;
//    private Marketplace marketplace;
//    private Marketplace marketplace2;
//    private Pond pond;
//    private Variety variety;
//    private Dictionary dictionary;
//
//    @BeforeEach
//    void setUp() {
//        // Initialize User (Seller)
//        seller = new User();
//        seller.setId(1);
//        seller.setUsername("seller");
//        seller.setEmail("seller@example.com");
//
//        // Initialize User (Buyer)
//        buyer = new User();
//        buyer.setId(2);
//        buyer.setUsername("buyer");
//        buyer.setEmail("buyer@example.com");
//
//        // Initialize Variety
//        variety = new Variety();
//        variety.setId(1);
//        variety.setName("Kohaku");
//
//        // Initialize Dictionary
//        dictionary = new Dictionary();
//        dictionary.setId(1);
//        dictionary.setVariety(variety);
//
//        // Initialize Pond
//        pond = new Pond();
//        pond.setId(1);
//        pond.setName("Pond 1");
//        pond.setCapacity(10);
//        pond.setOwner(seller);
//
//        // Initialize Koi
//        koi = new Koi();
//        koi.setId(1);
//        koi.setName("Kohaku 1");
//        koi.setGender(Gender.MALE);
//        koi.setWeight(BigDecimal.valueOf(5));
//        koi.setLength(BigDecimal.valueOf(50));
//        koi.setPond(pond);
//        koi.setDictionary(dictionary);
//
//        koi2 = new Koi();
//        koi2.setId(2);
//        koi2.setName("Shusui 1");
//        koi2.setGender(Gender.FEMALE);
//        koi2.setWeight(BigDecimal.valueOf(6));
//        koi2.setLength(BigDecimal.valueOf(55));
//        koi2.setPond(pond);
//        koi2.setDictionary(dictionary);
//
//        // Initialize Marketplace
//        marketplace = new Marketplace();
//        marketplace.setId(1);
//        marketplace.setKoi(koi);
//        marketplace.setSeller(seller);
//        marketplace.setPrice(1000L);
//        marketplace.setDescription("Beautiful Kohaku");
//
//        marketplace2 = new Marketplace();
//        marketplace2.setId(2);
//        marketplace2.setKoi(koi2);
//        marketplace2.setSeller(seller);
//        marketplace2.setPrice(1500L);
//        marketplace2.setDescription("Beautiful Shusui");;
//    }
//
//    // ==================== getMarketItems Tests ====================
//
//    @Test
//    void getMarketItems_success() {
//        // Given
//        when(marketRepository.findAll())
//                .thenReturn(List.of(marketplace, marketplace2));
//
//        // When
//        List<ResMarketDto> result = marketService.getMarketItems();
//
//        // Then
//        assertNotNull(result);
//        assertEquals(2, result.size());
//        assertEquals("Kohaku 1", result.get(0).getKoiName());
//        assertEquals(1000L, result.get(0).getPrice());
//        assertEquals("Shusui 1", result.get(1).getKoiName());
//        assertEquals(1500L, result.get(1).getPrice());
//
//        verify(marketRepository, times(1)).findAll();
//    }
//
//    @Test
//    void getMarketItems_empty() {
//        // Given
//        when(marketRepository.findAll()).thenReturn(List.of());
//
//        // When
//        List<ResMarketDto> result = marketService.getMarketItems();
//
//        // Then
//        assertNotNull(result);
//        assertEquals(0, result.size());
//
//        verify(marketRepository, times(1)).findAll();
//    }
//
//    // ==================== filterMarketplace Tests ====================
//
//    @Test
//    void filterMarketplace_noFilter_success() {
//        // Given
//        when(marketRepository.findAll(any(Specification.class)))
//                .thenReturn(List.of(marketplace, marketplace2));
//
//        // When
//        List<ResMarketDto> result = marketService.filterMarketplace(
//                null, null, null, null, null, null, null, null, null
//        );
//
//        // Then
//        assertNotNull(result);
//        assertEquals(2, result.size());
//        verify(marketRepository, times(1)).findAll(any(Specification.class));
//    }
//
//    @Test
//    void filterMarketplace_withKeyword_success() {
//        // Given
//        when(marketRepository.findAll(any(Specification.class)))
//                .thenReturn(List.of(marketplace));
//
//        // When
//        List<ResMarketDto> result = marketService.filterMarketplace(
//                "Kohaku", null, null, null, null, null, null, null, null
//        );
//
//        // Then
//        assertNotNull(result);
//        assertEquals(1, result.size());
//        assertEquals("Kohaku 1", result.get(0).getKoiName());
//        verify(marketRepository, times(1)).findAll(any(Specification.class));
//    }
//
//    @Test
//    void filterMarketplace_withCategory_success() {
//        // Given
//        when(marketRepository.findAll(any(Specification.class)))
//                .thenReturn(List.of(marketplace));
//
//        // When
//        List<ResMarketDto> result = marketService.filterMarketplace(
//                null, "KOHAKU", null, null, null, null, null, null, null
//        );
//
//        // Then
//        assertNotNull(result);
//        assertEquals(1, result.size());
//        verify(marketRepository, times(1)).findAll(any(Specification.class));
//    }
//
//    @Test
//    void filterMarketplace_withPriceRange_success() {
//        // Given
//        when(marketRepository.findAll(any(Specification.class)))
//                .thenReturn(List.of(marketplace));
//
//        // When
//        List<ResMarketDto> result = marketService.filterMarketplace(
//                null,
//                null,
//                BigDecimal.valueOf(900),
//                BigDecimal.valueOf(1100),
//                null,
//                null,
//                null,
//                null,
//                null
//        );
//
//        // Then
//        assertNotNull(result);
//        assertEquals(1, result.size());
//        assertEquals(1000L, result.get(0).getPrice());
//        verify(marketRepository, times(1)).findAll(any(Specification.class));
//    }
//
//    @Test
//    void filterMarketplace_withLengthRange_success() {
//        // Given
//        when(marketRepository.findAll(any(Specification.class)))
//                .thenReturn(List.of(marketplace));
//
//        // When
//        List<ResMarketDto> result = marketService.filterMarketplace(
//                null,
//                null,
//                null,
//                null,
//                BigDecimal.valueOf(40),
//                BigDecimal.valueOf(60),
//                null,
//                null,
//                null
//        );
//
//        // Then
//        assertNotNull(result);
//        assertEquals(1, result.size());
//        verify(marketRepository, times(1)).findAll(any(Specification.class));
//    }
//
//    @Test
//    void filterMarketplace_withWeightRange_success() {
//        // Given
//        when(marketRepository.findAll(any(Specification.class)))
//                .thenReturn(List.of(marketplace));
//
//        // When
//        List<ResMarketDto> result = marketService.filterMarketplace(
//                null,
//                null,
//                null,
//                null,
//                null,
//                null,
//                BigDecimal.valueOf(4),
//                BigDecimal.valueOf(6),
//                null
//        );
//
//        // Then
//        assertNotNull(result);
//        assertEquals(1, result.size());
//        verify(marketRepository, times(1)).findAll(any(Specification.class));
//    }
//
//    @Test
//    void filterMarketplace_withGender_success() {
//        // Given
//        when(marketRepository.findAll(any(Specification.class)))
//                .thenReturn(List.of(marketplace));
//
//        // When
//        List<ResMarketDto> result = marketService.filterMarketplace(
//                null, null, null, null, null, null, null, null, "MALE"
//        );
//
//        // Then
//        assertNotNull(result);
//        assertEquals(1, result.size());
//        assertEquals(Gender.MALE, result.get(0).getGender());
//        verify(marketRepository, times(1)).findAll(any(Specification.class));
//    }
//
//    @Test
//    void filterMarketplace_multipleFilters_success() {
//        // Given
//        when(marketRepository.findAll(any(Specification.class)))
//                .thenReturn(List.of(marketplace));
//
//        // When
//        List<ResMarketDto> result = marketService.filterMarketplace(
//                "Kohaku",
//                "KOHAKU",
//                BigDecimal.valueOf(900),
//                BigDecimal.valueOf(1100),
//                BigDecimal.valueOf(40),
//                BigDecimal.valueOf(60),
//                BigDecimal.valueOf(4),
//                BigDecimal.valueOf(6),
//                "MALE"
//        );
//
//        // Then
//        assertNotNull(result);
//        assertEquals(1, result.size());
//        verify(marketRepository, times(1)).findAll(any(Specification.class));
//    }
//
//    @Test
//    void filterMarketplace_noResults_empty() {
//        // Given
//        when(marketRepository.findAll(any(Specification.class)))
//                .thenReturn(List.of());
//
//        // When
//        List<ResMarketDto> result = marketService.filterMarketplace(
//                "NonExistent", null, null, null, null, null, null, null, null
//        );
//
//        // Then
//        assertNotNull(result);
//        assertEquals(0, result.size());
//    }
//
//    // ==================== getMarketListKois Tests ====================
//
//    @Test
//    void getMarketListKois_success() {
//        // Given
//        Integer userId = 1;
//        when(koiRepository.findAvailableKoisByUserId(userId))
//                .thenReturn(List.of(koi, koi2));
//
//        // When
//        List<ResMarketListKoi> result = marketService.getMarketListKois(userId);
//
//        // Then
//        assertNotNull(result);
//        assertEquals(2, result.size());
//        assertEquals(1, result.get(0).getKoiId());
//        assertEquals("Kohaku 1", result.get(0).getKoiName());
//        assertEquals(2, result.get(1).getKoiId());
//        assertEquals("Shusui 1", result.get(1).getKoiName());
//
//        verify(koiRepository, times(1)).findAvailableKoisByUserId(userId);
//    }
//
//    @Test
//    void getMarketListKois_empty_throwsException() {
//        // Given
//        Integer userId = 1;
//        when(koiRepository.findAvailableKoisByUserId(userId))
//                .thenReturn(List.of());
//
//        // When & Then
//        RuntimeException exception = assertThrows(RuntimeException.class,
//                () -> marketService.getMarketListKois(userId)
//        );
//        assertEquals("Your pond has not fish", exception.getMessage());
//
//        verify(koiRepository, times(1)).findAvailableKoisByUserId(userId);
//    }
//
//    // ==================== getMarketListBuyKois Tests ====================
//
//    @Test
//    void getMarketListBuyKois_success() {
//        // Given
//        Integer userId = 1;
//        when(marketRepository.findBySellerId(userId))
//                .thenReturn(List.of(marketplace, marketplace2));
//
//        // When
//        List<ResMarketKois> result = marketService.getMarketListBuyKois(userId);
//
//        // Then
//        assertNotNull(result);
//        assertEquals(2, result.size());
//        assertEquals(1, result.get(0).getKoiId());
//        assertEquals("Kohaku 1", result.get(0).getKoiName());
//        assertEquals(1000L, result.get(0).getPrice());
//        assertEquals(2, result.get(1).getKoiId());
//        assertEquals("Shusui 1", result.get(1).getKoiName());
//        assertEquals(1500L, result.get(1).getPrice());
//
//        verify(marketRepository, times(1)).findBySellerId(userId);
//    }
//
//    @Test
//    void getMarketListBuyKois_null_throwsException() {
//        // Given
//        Integer userId = 99;
//        when(marketRepository.findBySellerId(userId))
//                .thenReturn(null);
//
//        // When & Then
//        RuntimeException exception = assertThrows(RuntimeException.class,
//                () -> marketService.getMarketListBuyKois(userId)
//        );
//        assertEquals("Your pond has not fish", exception.getMessage());
//
//        verify(marketRepository, times(1)).findBySellerId(userId);
//    }
//
//    // ==================== sellKoi Tests ====================
//
//    @Test
//    void sellKoi_success() {
//        // Given
//        Integer userId = 1;
//        ResMarketSellKoi request = new ResMarketSellKoi();
//        request.setKoiId(1);
//        request.setPrice(1000L);
//
//        when(koiRepository.findById(1)).thenReturn(Optional.of(koi));
//        when(marketRepository.save(any(Marketplace.class))).thenReturn(marketplace);
//
//        // When
//        ResMarketDto result = marketService.sellKoi(userId, request);
//
//        // Then
//        assertNotNull(result);
//        assertEquals("Kohaku 1", result.getKoiName());
//        assertEquals(1000L, result.getPrice());
//        assertEquals(1, result.getSellerId());
//        assertEquals("seller", result.getSeller());
//
//        verify(koiRepository, times(1)).findById(1);
//        verify(marketRepository, times(1)).save(any(Marketplace.class));
//    }
//
//    @Test
//    void sellKoi_wrongUser_throwsException() {
//        // Given
//        Integer userId = 2; // Different from seller
//        ResMarketSellKoi request = new ResMarketSellKoi();
//        request.setKoiId(1);
//        request.setPrice(1000L);
//
//        when(koiRepository.findById(1)).thenReturn(Optional.of(koi));
//
//        // When & Then
//        RuntimeException exception = assertThrows(RuntimeException.class,
//                () -> marketService.sellKoi(userId, request)
//        );
//        assertEquals("Not find your koi fish", exception.getMessage());
//
//        verify(koiRepository, times(1)).findById(1);
//        verify(marketRepository, never()).save(any());
//    }
//
//    @Test
//    void sellKoi_invalidPrice_throwsException() {
//        // Given
//        Integer userId = 1;
//        ResMarketSellKoi request = new ResMarketSellKoi();
//        request.setKoiId(1);
//        request.setPrice(0L); // Invalid price
//
//        when(koiRepository.findById(1)).thenReturn(Optional.of(koi));
//
//        // When & Then
//        RuntimeException exception = assertThrows(RuntimeException.class,
//                () -> marketService.sellKoi(userId, request)
//        );
//        assertEquals("The selling price must be greater than 0.", exception.getMessage());
//
//        verify(koiRepository, times(1)).findById(1);
//        verify(marketRepository, never()).save(any());
//    }
//
//    @Test
//    void sellKoi_nullPrice_throwsException() {
//        // Given
//        Integer userId = 1;
//        ResMarketSellKoi request = new ResMarketSellKoi();
//        request.setKoiId(1);
//        request.setPrice(null); // Null price
//
//        when(koiRepository.findById(1)).thenReturn(Optional.of(koi));
//
//        // When & Then
//        RuntimeException exception = assertThrows(RuntimeException.class,
//                () -> marketService.sellKoi(userId, request)
//        );
//        assertEquals("The selling price must be greater than 0.", exception.getMessage());
//
//        verify(koiRepository, times(1)).findById(1);
//        verify(marketRepository, never()).save(any());
//    }
//
//    @Test
//    void sellKoi_negativePrice_throwsException() {
//        // Given
//        Integer userId = 1;
//        ResMarketSellKoi request = new ResMarketSellKoi();
//        request.setKoiId(1);
//        request.setPrice(-100L); // Negative price
//
//        when(koiRepository.findById(1)).thenReturn(Optional.of(koi));
//
//        // When & Then
//        RuntimeException exception = assertThrows(RuntimeException.class,
//                () -> marketService.sellKoi(userId, request)
//        );
//        assertEquals("The selling price must be greater than 0.", exception.getMessage());
//
//        verify(marketRepository, never()).save(any());
//    }
//
//    // ==================== deleteKoi Tests ====================
//
//    @Test
//    void deleteKoi_success() {
//        // Given
//        ReqMarketDeleteKoi request = new ReqMarketDeleteKoi();
//        request.setUserId(1);
//        request.setKoiId(1);
//
//        when(marketRepository.findBySellerIdAndKoiId(1, 1))
//                .thenReturn(Optional.of(marketplace));
//
//        // When
//        marketService.deleteKoi(request);
//
//        // Then
//        verify(marketRepository, times(1)).findBySellerIdAndKoiId(1, 1);
//        verify(marketRepository, times(1)).delete(marketplace);
//    }
//
//    @Test
//    void deleteKoi_notFound_throwsException() {
//        // Given
//        ReqMarketDeleteKoi request = new ReqMarketDeleteKoi();
//        request.setUserId(1);
//        request.setKoiId(999);
//
//        when(marketRepository.findBySellerIdAndKoiId(1, 999))
//                .thenReturn(Optional.empty());
//
//        // When & Then
//        RuntimeException exception = assertThrows(RuntimeException.class,
//                () -> marketService.deleteKoi(request)
//        );
//        assertEquals("Not found koi in marketplace", exception.getMessage());
//
//        verify(marketRepository, times(1)).findBySellerIdAndKoiId(1, 999);
//    }
//
//    @Test
//    void deleteKoi_multipleDeletes() {
//        // Given
//        ReqMarketDeleteKoi request1 = new ReqMarketDeleteKoi();
//        request1.setUserId(1);
//        request1.setKoiId(1);
//
//        ReqMarketDeleteKoi request2 = new ReqMarketDeleteKoi();
//        request2.setUserId(1);
//        request2.setKoiId(2);
//
//        when(marketRepository.findBySellerIdAndKoiId(1, 1))
//                .thenReturn(Optional.of(marketplace));
//        when(marketRepository.findBySellerIdAndKoiId(1, 2))
//                .thenReturn(Optional.of(marketplace2));
//
//        // When
//        marketService.deleteKoi(request1);
//        marketService.deleteKoi(request2);
//    }
//
//    // ==================== buyKoi Tests ====================
//
//    @Test
//    void buyKoi_success() {
//        // Given
//        Integer buyerId = 2;
//        ReqBuyKoi request = new ReqBuyKoi();
//        request.setSellerId(1);
//        request.setKoiId(1);
//        request.setPrice(1000L);
//        request.setPondId(1);
//
//        Pond buyerPond = new Pond();
//        buyerPond.setId(1);
//        buyerPond.setCapacity(10);
//        buyerPond.setOwner(buyer);
//
//        when(marketRepository.findBySellerIdAndKoiId(1, 1))
//                .thenReturn(Optional.of(marketplace));
//        when(userRepository.findById(1)).thenReturn(Optional.of(seller));
//        when(userRepository.findById(2)).thenReturn(Optional.of(buyer));
//        when(koiRepository.findById(1)).thenReturn(Optional.of(koi));
//        when(pondRepository.findById(1)).thenReturn(Optional.of(buyerPond));
//        when(koiRepository.countByPond_Id(1)).thenReturn(0L);
//        when(pondRepository.save(any(Pond.class))).thenReturn(buyerPond);
//        when(koiRepository.save(any(Koi.class))).thenReturn(koi);
//
//        // When
//        ResTradeDto result = marketService.buyKoi(buyerId, request);
//
//        // Then
//        assertNotNull(result);
//        assertEquals(2, result.getBuyer());
//        assertEquals(1, result.getSeller());
//        assertEquals(1000L, result.getPrice());
//
//        verify(marketRepository, times(1)).findBySellerIdAndKoiId(1, 1);
//        verify(walletService, times(1)).deduct(2, BigDecimal.valueOf(1000L));
//        verify(walletService, times(1)).credit(1, BigDecimal.valueOf(1000L));
//        verify(marketRepository, times(1)).delete(marketplace);
//    }
//
//    @Test
//    void buyKoi_buyFromSelf_throwsException() {
//        // Given
//        Integer userId = 1;
//        ReqBuyKoi request = new ReqBuyKoi();
//        request.setSellerId(1);
//        request.setKoiId(1);
//        request.setPrice(1000L);
//        request.setPondId(1);
//
//        when(marketRepository.findBySellerIdAndKoiId(1, 1))
//                .thenReturn(Optional.of(marketplace));
//
//        // When & Then
//        RuntimeException exception = assertThrows(RuntimeException.class,
//                () -> marketService.buyKoi(userId, request)
//        );
//        assertEquals("You are not allowed to buy fish from yourself.", exception.getMessage());
//
//        verify(walletService, never()).deduct(anyInt(), any());
//        verify(walletService, never()).credit(anyInt(), any());
//    }
//
//    @Test
//    void buyKoi_invalidPrice_throwsException() {
//        // Given
//        Integer buyerId = 2;
//        ReqBuyKoi request = new ReqBuyKoi();
//        request.setSellerId(1);
//        request.setKoiId(1);
//        request.setPrice(900L); // Different from marketplace price
//        request.setPondId(1);
//
//        when(marketRepository.findBySellerIdAndKoiId(1, 1))
//                .thenReturn(Optional.of(marketplace)); // Price = 1000L
//
//        // When & Then
//        RuntimeException exception = assertThrows(RuntimeException.class,
//                () -> marketService.buyKoi(buyerId, request)
//        );
//        assertEquals("Invalid price", exception.getMessage());
//
//        verify(walletService, never()).deduct(anyInt(), any());
//        verify(walletService, never()).credit(anyInt(), any());
//    }
//
//    @Test
//    void buyKoi_pondNotBelongToBuyer_throwsException() {
//        // Given
//        Integer buyerId = 2;
//        ReqBuyKoi request = new ReqBuyKoi();
//        request.setSellerId(1);
//        request.setKoiId(1);
//        request.setPrice(1000L);
//        request.setPondId(1);
//
//        Pond otherPond = new Pond();
//        otherPond.setId(1);
//        otherPond.setOwner(seller); // Different owner
//
//        when(marketRepository.findBySellerIdAndKoiId(1, 1))
//                .thenReturn(Optional.of(marketplace));
//        when(userRepository.findById(1)).thenReturn(Optional.of(seller));
//        when(userRepository.findById(2)).thenReturn(Optional.of(buyer));
//        when(koiRepository.findById(1)).thenReturn(Optional.of(koi));
//        when(pondRepository.findById(1)).thenReturn(Optional.of(otherPond));
//
//        // When & Then
//        RuntimeException exception = assertThrows(RuntimeException.class,
//                () -> marketService.buyKoi(buyerId, request)
//        );
//        assertEquals("Pond does not belong to buyer", exception.getMessage());
//
//        verify(walletService, never()).deduct(anyInt(), any());
//        verify(walletService, never()).credit(anyInt(), any());
//    }
//
//    @Test
//    void buyKoi_pondFull_throwsException() {
//        // Given
//        Integer buyerId = 2;
//        ReqBuyKoi request = new ReqBuyKoi();
//        request.setSellerId(1);
//        request.setKoiId(1);
//        request.setPrice(1000L);
//        request.setPondId(1);
//
//        Pond buyerPond = new Pond();
//        buyerPond.setId(1);
//        buyerPond.setCapacity(2);
//        buyerPond.setOwner(buyer);
//
//        when(marketRepository.findBySellerIdAndKoiId(1, 1))
//                .thenReturn(Optional.of(marketplace));
//        when(userRepository.findById(1)).thenReturn(Optional.of(seller));
//        when(userRepository.findById(2)).thenReturn(Optional.of(buyer));
//        when(koiRepository.findById(1)).thenReturn(Optional.of(koi));
//        when(pondRepository.findById(1)).thenReturn(Optional.of(buyerPond));
//        when(koiRepository.countByPond_Id(1)).thenReturn(2L); // Pond is full
//
//        // When & Then
//        RuntimeException exception = assertThrows(RuntimeException.class,
//                () -> marketService.buyKoi(buyerId, request)
//        );
//        assertEquals("Pond is full", exception.getMessage());
//
//        verify(walletService, never()).deduct(anyInt(), any());
//        verify(walletService, never()).credit(anyInt(), any());
//    }
//
//    @Test
//    void buyKoi_marketplaceNotFound_throwsException() {
//        // Given
//        Integer buyerId = 2;
//        ReqBuyKoi request = new ReqBuyKoi();
//        request.setSellerId(1);
//        request.setKoiId(999);
//        request.setPrice(1000L);
//        request.setPondId(1);
//
//        when(marketRepository.findBySellerIdAndKoiId(1, 999))
//                .thenReturn(Optional.empty());
//
//        // When & Then
//        RuntimeException exception = assertThrows(RuntimeException.class,
//                () -> marketService.buyKoi(buyerId, request)
//        );
//        assertEquals("Koi not found in marketplace", exception.getMessage());
//
//        verify(walletService, never()).deduct(anyInt(), any());
//        verify(walletService, never()).credit(anyInt(), any());
//    }
//
//    @Test
//    void buyKoi_userNotFound_throwsException() {
//        // Given
//        Integer buyerId = 999;
//        ReqBuyKoi request = new ReqBuyKoi();
//        request.setSellerId(1);
//        request.setKoiId(1);
//        request.setPrice(1000L);
//        request.setPondId(1);
//
//        when(marketRepository.findBySellerIdAndKoiId(1, 1))
//                .thenReturn(Optional.of(marketplace));
//        when(userRepository.findById(1)).thenReturn(Optional.of(seller));
//        when(userRepository.findById(999)).thenReturn(Optional.empty());
//
//        // When & Then
//        RuntimeException exception = assertThrows(RuntimeException.class,
//                () -> marketService.buyKoi(buyerId, request)
//        );
//        assertEquals("User not found", exception.getMessage());
//
//        verify(walletService, never()).deduct(anyInt(), any());
//        verify(walletService, never()).credit(anyInt(), any());
//    }
//
//    @Test
//    void buyKoi_koiNotFound_throwsException() {
//        // Given
//        Integer buyerId = 2;
//        ReqBuyKoi request = new ReqBuyKoi();
//        request.setSellerId(1);
//        request.setKoiId(999);
//        request.setPrice(1000L);
//        request.setPondId(1);
//
//        when(marketRepository.findBySellerIdAndKoiId(1, 999))
//                .thenReturn(Optional.of(marketplace));
//        when(userRepository.findById(1)).thenReturn(Optional.of(seller));
//        when(userRepository.findById(2)).thenReturn(Optional.of(buyer));
//        when(koiRepository.findById(999)).thenReturn(Optional.empty());
//
//        // When & Then
//        RuntimeException exception = assertThrows(RuntimeException.class,
//                () -> marketService.buyKoi(buyerId, request)
//        );
//        assertEquals("Koi not found", exception.getMessage());
//
//        verify(walletService, never()).deduct(anyInt(), any());
//        verify(walletService, never()).credit(anyInt(), any());
//    }
//
//    @Test
//    void buyKoi_pondNotFound_throwsException() {
//        // Given
//        Integer buyerId = 2;
//        ReqBuyKoi request = new ReqBuyKoi();
//        request.setSellerId(1);
//        request.setKoiId(1);
//        request.setPrice(1000L);
//        request.setPondId(999);
//
//        when(marketRepository.findBySellerIdAndKoiId(1, 1))
//                .thenReturn(Optional.of(marketplace));
//        when(userRepository.findById(1)).thenReturn(Optional.of(seller));
//        when(userRepository.findById(2)).thenReturn(Optional.of(buyer));
//        when(koiRepository.findById(1)).thenReturn(Optional.of(koi));
//        when(pondRepository.findById(999)).thenReturn(Optional.empty());
//
//        // When & Then
//        RuntimeException exception = assertThrows(RuntimeException.class,
//                () -> marketService.buyKoi(buyerId, request)
//        );
//        assertEquals("Pond not found", exception.getMessage());
//
//        verify(walletService, never()).deduct(anyInt(), any());
//        verify(walletService, never()).credit(anyInt(), any());
//    }
//
//    @Test
//    void buyKoi_walletDeductionFlow() {
//        // Given
//        Integer buyerId = 2;
//        ReqBuyKoi request = new ReqBuyKoi();
//        request.setSellerId(1);
//        request.setKoiId(1);
//        request.setPrice(1000L);
//        request.setPondId(1);
//
//        Pond buyerPond = new Pond();
//        buyerPond.setId(1);
//        buyerPond.setCapacity(10);
//        buyerPond.setOwner(buyer);
//
//        when(marketRepository.findBySellerIdAndKoiId(1, 1))
//                .thenReturn(Optional.of(marketplace));
//        when(userRepository.findById(1)).thenReturn(Optional.of(seller));
//        when(userRepository.findById(2)).thenReturn(Optional.of(buyer));
//        when(koiRepository.findById(1)).thenReturn(Optional.of(koi));
//        when(pondRepository.findById(1)).thenReturn(Optional.of(buyerPond));
//        when(koiRepository.countByPond_Id(1)).thenReturn(0L);
//        when(pondRepository.save(any(Pond.class))).thenReturn(buyerPond);
//        when(koiRepository.save(any(Koi.class))).thenReturn(koi);
//
//        // When
//        marketService.buyKoi(buyerId, request);
//
//        // Then - Verify wallet operations
//        ArgumentCaptor<BigDecimal> deductCaptor = ArgumentCaptor.forClass(BigDecimal.class);
//        verify(walletService).deduct(eq(2), deductCaptor.capture());
//        assertEquals(BigDecimal.valueOf(1000L), deductCaptor.getValue());
//
//        ArgumentCaptor<BigDecimal> creditCaptor = ArgumentCaptor.forClass(BigDecimal.class);
//        verify(walletService).credit(eq(1), creditCaptor.capture());
//        assertEquals(BigDecimal.valueOf(1000L), creditCaptor.getValue());
//    }
//
//    @Test
//    void buyKoi_transactionRollback_verifyNoWalletChanges() {
//        // Given
//        Integer buyerId = 2;
//        ReqBuyKoi request = new ReqBuyKoi();
//        request.setSellerId(1);
//        request.setKoiId(1);
//        request.setPrice(1000L);
//        request.setPondId(1);
//
//        when(marketRepository.findBySellerIdAndKoiId(1, 1))
//                .thenReturn(Optional.of(marketplace));
//        when(userRepository.findById(2)).thenReturn(Optional.of(buyer));
//
//        // Simulate pond not found to trigger exception
//        when(userRepository.findById(1)).thenReturn(Optional.of(seller));
//        when(koiRepository.findById(1)).thenReturn(Optional.of(koi));
//        when(pondRepository.findById(1)).thenReturn(Optional.empty());
//
//        // When & Then
//        assertThrows(RuntimeException.class,
//                () -> marketService.buyKoi(buyerId, request)
//        );
//
//        // Verify wallet was never called
//        verify(walletService, never()).deduct(anyInt(), any());
//        verify(walletService, never()).credit(anyInt(), any());
//    }
//}