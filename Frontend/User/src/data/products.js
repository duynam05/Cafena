// Central Product Catalog for Cafena Coffee
// Includes Packaged Coffee, Menu Beverages, Equipment, Accessories, and Grinders

export const PACKAGED_PRODUCTS = [
  {
    id: 'packaged-1',
    slug: 'cafe-1',
    name: 'Cafe 1',
    price: 410000,
    originalPrice: null,
    image: '/img/1_53dca42ae400412e9993f78087279535_large.webp',
    gallery: [
      '/img/1_53dca42ae400412e9993f78087279535_large.webp',
      '/img/2_2cc8af50a4674fe6ab472435d334e18e_large.webp',
      '/img/3_81820de77c0f4c62966c026b9639c292_large.webp'
    ],
    isOutOfStock: true,
    stockQuantity: 0,
    badge: 'HẾT HÀNG',
    category: 'packaged',
    categoryName: 'Sản phẩm đóng gói',
    description: '100% hạt cà phê mộc nguyên chất, rang đậm theo công thức truyền thống, hương vị thơm nồng nàn.'
  },
  {
    id: 'packaged-2',
    slug: 'cafe-2',
    name: 'Cafe 2',
    price: 250000,
    originalPrice: 290000,
    discountPercent: 14,
    image: '/img/2_2cc8af50a4674fe6ab472435d334e18e_large.webp',
    gallery: [
      '/img/2_2cc8af50a4674fe6ab472435d334e18e_large.webp',
      '/img/3_81820de77c0f4c62966c026b9639c292_large.webp',
      '/img/4_94490edda70148eda96ac41fb39e288f_large.webp'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    badges: ['SALE', '-14%'],
    category: 'packaged',
    categoryName: 'Sản phẩm đóng gói',
    description: 'Sự kết hợp hoàn hảo giữa Arabica và Robusta hảo hạng, vị đắng dịu êm ái cùng hậu ngọt sâu.'
  },
  {
    id: 'packaged-3',
    slug: 'cafe-3',
    name: 'Cafe 3',
    price: 355000,
    originalPrice: null,
    image: '/img/3_81820de77c0f4c62966c026b9639c292_large.webp',
    gallery: [
      '/img/3_81820de77c0f4c62966c026b9639c292_large.webp',
      '/img/2_2cc8af50a4674fe6ab472435d334e18e_large.webp',
      '/img/4_94490edda70148eda96ac41fb39e288f_large.webp'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'packaged',
    categoryName: 'Sản phẩm đóng gói',
    description: 'Cà phê rang mộc thượng hạng hạt Arabica Cầu Đất, hương vị trái cây tự nhiên tinh tế.'
  },
  {
    id: 'packaged-4',
    slug: 'cafe-4',
    name: 'Cafe 4',
    price: 320000,
    originalPrice: null,
    image: '/img/4_94490edda70148eda96ac41fb39e288f_large.webp',
    gallery: [
      '/img/4_94490edda70148eda96ac41fb39e288f_large.webp',
      '/img/1_53dca42ae400412e9993f78087279535_large.webp',
      '/img/3_81820de77c0f4c62966c026b9639c292_large.webp'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'packaged',
    categoryName: 'Sản phẩm đóng gói',
    description: 'Dòng cà phê cao cấp Specialty Roasting thơm ngát, đánh thức mọi giác quan của người sành cà phê.'
  },
  {
    id: 'packaged-5',
    slug: 'cafe-5',
    name: 'Cafe 5',
    price: 290000,
    originalPrice: null,
    image: '/img/1_53dca42ae400412e9993f78087279535_large.webp',
    gallery: [
      '/img/1_53dca42ae400412e9993f78087279535_large.webp',
      '/img/2_2cc8af50a4674fe6ab472435d334e18e_large.webp',
      '/img/4_94490edda70148eda96ac41fb39e288f_large.webp'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'packaged',
    categoryName: 'Sản phẩm đóng gói',
    description: 'Hạt cà phê nguyên chất đóng túi cao cấp giữ trọn vẹn hương vị tự nhiên tươi mới.'
  },
  {
    id: 'packaged-6',
    slug: 'cafe-6',
    name: 'Cafe 6',
    price: 320000,
    originalPrice: null,
    image: '/img/4_94490edda70148eda96ac41fb39e288f_large.webp',
    gallery: [
      '/img/4_94490edda70148eda96ac41fb39e288f_large.webp',
      '/img/3_81820de77c0f4c62966c026b9639c292_large.webp',
      '/img/2_2cc8af50a4674fe6ab472435d334e18e_large.webp'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'packaged',
    categoryName: 'Sản phẩm đóng gói',
    description: 'Phiên bản cà phê thượng hạng với hương thơm quyến rũ và vị đắng đậm đà khó quên.'
  }
];

export const MENU_DRINKS = [
  {
    id: 'sig-1',
    slug: 'cafe-den-nong',
    name: 'Cafe đen nóng',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 25000,
    originalPrice: null,
    image: '/img/cafe_den_nong_c53df31dd7bc4f23967e2a09eaf96ae9_0b832f13c2d246329e3fe1bed0627a9b_large.png',
    smallImage: '/img/cafe_den_nong_c53df31dd7bc4f23967e2a09eaf96ae9_0b832f13c2d246329e3fe1bed0627a9b_small.webp',
    gallery: [
      '/img/cafe_den_nong_c53df31dd7bc4f23967e2a09eaf96ae9_0b832f13c2d246329e3fe1bed0627a9b_large.png',
      '/img/cafe_muoi_c4c5f099cbc248679335eba5fcbfdf0b_48fc9609567d4a7bb32467069dd60bcd_large.webp',
      '/img/cafe_sua_da_ee2490f7d7dc47748ae88e323b31fa2b_eab075b7a57149fe80a152ade1b9cbc3_large.png'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'menu',
    categoryName: 'Menu',
    description: 'It is produced by grinding roasted coffee beans, then boiling them. Hương vị cafe đen nguyên chất thơm nồng truyền thống, mang đến sự tỉnh táo sảng khoái cho ngày dài năng động.'
  },
  {
    id: 'sig-2',
    slug: 'cafe-sua-da',
    name: 'Cafe sữa đá',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 25000,
    originalPrice: 30000,
    discountPercent: 17,
    badges: ['SALE', '-17%'],
    image: '/img/cafe_sua_da_ee2490f7d7dc47748ae88e323b31fa2b_eab075b7a57149fe80a152ade1b9cbc3_large.png',
    smallImage: '/img/cafe_sua_da_ee2490f7d7dc47748ae88e323b31fa2b_eab075b7a57149fe80a152ade1b9cbc3_small.webp',
    gallery: [
      '/img/cafe_sua_da_ee2490f7d7dc47748ae88e323b31fa2b_eab075b7a57149fe80a152ade1b9cbc3_large.png',
      '/img/cafe_den_nong_c53df31dd7bc4f23967e2a09eaf96ae9_0b832f13c2d246329e3fe1bed0627a9b_large.png',
      '/img/cafe_sua_nong_65937f23b853420080a8190e972d3e9a_a9a31b27d34c489a972023b6d21e54ec_large.webp'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'menu',
    categoryName: 'Menu',
    description: 'It is produced by grinding roasted coffee beans, then boiling them. Cafe sữa đá ngọt ngào mát lạnh đậm chất Sài Gòn, hòa quyện sữa đặc thơm béo và cà phê Robusta hảo hạng.'
  },
  {
    id: 'sig-3',
    slug: 'capuchino',
    name: 'Capuchino',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 38000,
    originalPrice: null,
    image: '/img/capuchino_2_0f38ce14337b400783e7fa3222ec7129_a7b20c54d10648e190a5dd5aff7d871f_large.png',
    smallImage: '/img/capuchino_2_0f38ce14337b400783e7fa3222ec7129_a7b20c54d10648e190a5dd5aff7d871f_small.webp',
    gallery: [
      '/img/capuchino_2_0f38ce14337b400783e7fa3222ec7129_a7b20c54d10648e190a5dd5aff7d871f_large.png',
      '/img/cafe_muoi_c4c5f099cbc248679335eba5fcbfdf0b_48fc9609567d4a7bb32467069dd60bcd_large.webp',
      '/img/cookie_da_xay_6a17637f63bd4be2ab93b9e75b99e014_4807fca8cd5840fa80e1dc310ef80089_large.webp'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'menu',
    categoryName: 'Menu',
    description: 'It is produced by grinding roasted coffee beans, then boiling them. Lớp bọt sữa bồng bềnh mịn màng cùng nghệ thuật tạo hình latte art tinh tế kết hợp shot espresso đậm vị Ý.'
  },
  {
    id: 'sig-4',
    slug: 'cafe-muoi',
    name: 'Cafe muối',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 30000,
    originalPrice: null,
    image: '/img/cafe_muoi_c4c5f099cbc248679335eba5fcbfdf0b_48fc9609567d4a7bb32467069dd60bcd_large.webp',
    smallImage: '/img/cafe_muoi_c4c5f099cbc248679335eba5fcbfdf0b_48fc9609567d4a7bb32467069dd60bcd_small.webp',
    gallery: [
      '/img/cafe_muoi_c4c5f099cbc248679335eba5fcbfdf0b_48fc9609567d4a7bb32467069dd60bcd_large.webp',
      '/img/cafe_den_nong_c53df31dd7bc4f23967e2a09eaf96ae9_0b832f13c2d246329e3fe1bed0627a9b_large.png',
      '/img/capuchino_2_0f38ce14337b400783e7fa3222ec7129_a7b20c54d10648e190a5dd5aff7d871f_large.png'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'menu',
    categoryName: 'Menu',
    description: 'It is produced by grinding roasted coffee beans, then boiling them. Vị đậm đà của cafe hòa quyện cùng lớp kem muối béo ngậy mằn mặn đặc trưng xứ Huế, tạo nên trải nghiệm vị giác độc đáo.'
  },
  {
    id: 'sig-5',
    slug: 'cafe-sua-nong',
    name: 'Cafe sữa nóng',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 25000,
    originalPrice: null,
    image: '/img/cafe_sua_nong_65937f23b853420080a8190e972d3e9a_a9a31b27d34c489a972023b6d21e54ec_large.webp',
    smallImage: '/img/cafe_sua_nong_65937f23b853420080a8190e972d3e9a_a9a31b27d34c489a972023b6d21e54ec_small.webp',
    gallery: [
      '/img/cafe_sua_nong_65937f23b853420080a8190e972d3e9a_a9a31b27d34c489a972023b6d21e54ec_large.webp',
      '/img/cafe_den_nong_c53df31dd7bc4f23967e2a09eaf96ae9_0b832f13c2d246329e3fe1bed0627a9b_large.png',
      '/img/cafe_sua_da_ee2490f7d7dc47748ae88e323b31fa2b_eab075b7a57149fe80a152ade1b9cbc3_large.png'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'menu',
    categoryName: 'Menu',
    description: 'It is produced by grinding roasted coffee beans, then boiling them. Ly cafe sữa ấm áp cho ngày mới tràn đầy hứng khởi và năng lượng tích cực, thơm phức hương cà phê nguyên chất.'
  },
  {
    id: 'sig-6',
    slug: 'cookie-da-xay',
    name: 'Cookie đá xay',
    desc: 'It is produced by grinding roasted coffee beans, then boiling them.',
    price: 45000,
    originalPrice: null,
    image: '/img/cookie_da_xay_6a17637f63bd4be2ab93b9e75b99e014_4807fca8cd5840fa80e1dc310ef80089_large.webp',
    smallImage: '/img/cookie_da_xay_6a17637f63bd4be2ab93b9e75b99e014_4807fca8cd5840fa80e1dc310ef80089_small.webp',
    gallery: [
      '/img/cookie_da_xay_6a17637f63bd4be2ab93b9e75b99e014_4807fca8cd5840fa80e1dc310ef80089_large.webp',
      '/img/capuchino_2_0f38ce14337b400783e7fa3222ec7129_a7b20c54d10648e190a5dd5aff7d871f_large.png',
      '/img/cafe_muoi_c4c5f099cbc248679335eba5fcbfdf0b_48fc9609567d4a7bb32467069dd60bcd_large.webp'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'menu',
    categoryName: 'Menu',
    description: 'It is produced by grinding roasted coffee beans, then boiling them. Đá xay xay nhuyễn mát lạnh cùng bánh Oreo giòn tan và lớp whipping cream béo ngậy cực kỳ hấp dẫn.'
  }
];

export const EQUIPMENT_PRODUCTS = [
  // Nhóm 1: Ấm Moka Pot (Chiết xuất áp suất kiểu Ý)
  {
    id: 'equipment-1',
    slug: 'bialetti-brikka-cam-ung-4-coc',
    name: 'Bialetti Brikka cảm ứng 4 cốc',
    price: 4739040,
    originalPrice: null,
    image: '/img/moka_bialetti_brikka.jpg',
    gallery: [
      '/img/moka_bialetti_brikka.jpg',
      '/img/moka_nhom_kieu_y.jpg',
      '/img/french_press_bodum_chambord.jpg'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'equipment',
    categoryName: 'Dụng cụ pha cà phê',
    groupName: 'Nhóm 1: Ấm Moka Pot (Chiết xuất áp suất kiểu Ý)',
    description: 'Mẫu Bình pha cà phê bếp từ Bialetti BRIKKA INDUCTION 4 CUPS 0007317 sở hữu van tăng áp đặc biệt giúp tạo lớp crema béo ngậy và tương thích với bếp từ.',
    rating: 4.4,
    reviewCount: 163
  },
  {
    id: 'equipment-2',
    slug: 'am-pha-ca-phe-moka-pot-bang-nhom',
    name: 'Ấm pha cà phê Moka Pot bằng nhôm, bình pha cà phê kiểu Ý',
    price: 225000,
    originalPrice: null,
    image: '/img/moka_nhom_kieu_y.jpg',
    gallery: [
      '/img/moka_nhom_kieu_y.jpg',
      '/img/moka_bialetti_brikka.jpg',
      '/img/french_press_bodum_chambord.jpg'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'equipment',
    categoryName: 'Dụng cụ pha cà phê',
    groupName: 'Nhóm 1: Ấm Moka Pot (Chiết xuất áp suất kiểu Ý)',
    description: 'Chiếc Ấm pha cà phê Moka Pot bằng nhôm, bình pha cà phê kiểu Ý là giải pháp chi phí tiết kiệm, sử dụng chất liệu nhôm truyền thống đun tốt trên bếp ga hoặc bếp điện.',
    rating: 4.7,
    reviewCount: 268
  },

  // Nhóm 2: Bình French Press (Pha ngâm ủ & lọc nén)
  {
    id: 'equipment-3',
    slug: 'binh-pha-ca-phe-bodum-coc-chambord',
    name: 'Bình pha cà phê Bodum cốc Chambord',
    price: 1284000,
    originalPrice: null,
    image: '/img/french_press_bodum_chambord.jpg',
    gallery: [
      '/img/french_press_bodum_chambord.jpg',
      '/img/french_press_locknlock_llg018.jpg',
      '/img/moka_bialetti_brikka.jpg'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'equipment',
    categoryName: 'Dụng cụ pha cà phê',
    groupName: 'Nhóm 2: Bình French Press (Pha ngâm ủ & lọc nén)',
    description: 'Bình pha cà phê Bodum cốc Chambord viền mạ đồng cổ điển, kết hợp thủy tinh chịu nhiệt sang trọng cho quầy bar.',
    rating: 4.7,
    reviewCount: 234
  },
  {
    id: 'equipment-4',
    slug: 'llg018-binh-pha-ca-phe-french-press-locknlock',
    name: 'LLG018 BÌNH PHA CÀ PHÊ French Press Lock&Lock',
    price: 338000,
    originalPrice: null,
    image: '/img/french_press_locknlock_llg018.jpg',
    gallery: [
      '/img/french_press_locknlock_llg018.jpg',
      '/img/french_press_bodum_chambord.jpg',
      '/img/pheu_v60_hario_vdr02.jpg'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'equipment',
    categoryName: 'Dụng cụ pha cà phê',
    groupName: 'Nhóm 2: Bình French Press (Pha ngâm ủ & lọc nén)',
    description: 'Bình LLG018 - BÌNH PHA CÀ PHÊ French Press LocknLock, 800ml - Màu Đen có dung tích lớn 800ml, thích hợp phục vụ nhiều tách cà phê hoặc ủ trà cùng lúc.',
    rating: 4.9,
    reviewCount: 227
  },

  // Nhóm Phụ kiện (Vệ sinh, Giấy lọc & Phễu, Thao tác Espresso)
  {
    id: 'accessory-1',
    slug: 'choi-ve-sinh-may-pha-ca-phe-can-go',
    name: 'Chổi vệ sinh máy pha cà phê - cán gỗ, lông nhân tạo, 18.5×2 cm, 20 g',
    price: 18000,
    originalPrice: 19000,
    discountPercent: 5,
    badges: ['SALE', '-5%'],
    image: '/img/choi_ve_sinh_can_go.jpg',
    gallery: [
      '/img/choi_ve_sinh_can_go.jpg',
      '/img/co_ve_sinh_hong_may.jpg'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'accessory',
    categoryName: 'Phụ kiện',
    groupName: '1. Phụ kiện vệ sinh & Bảo quản',
    description: 'Mẫu Chổi vệ sinh máy pha cà phê - cán gỗ, lông nhân tạo, 18.5×2 cm, 20 g có lông mềm và cán gỗ nhỏ gọn, giúp quét sạch bột cà phê đọng trong cối xay nhanh chóng.',
    rating: 4.7,
    reviewCount: 17
  },
  {
    id: 'accessory-2',
    slug: 'choi-ve-sinh-may-pha-may-xay-ca-phe-co-ve-sinh-hong-may',
    name: 'Chổi vệ sinh máy pha, máy xay cà phê, Cọ vệ sinh họng máy Pha cà phê Espresso - Dụng Cụ Pha Chế Hà Nam',
    price: 50000,
    originalPrice: null,
    image: '/img/co_ve_sinh_hong_may.jpg',
    gallery: [
      '/img/co_ve_sinh_hong_may.jpg',
      '/img/choi_ve_sinh_can_go.jpg'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'accessory',
    categoryName: 'Phụ kiện',
    groupName: '1. Phụ kiện vệ sinh & Bảo quản',
    description: 'Sản phẩm Chổi vệ sinh máy pha, máy xay cà phê, Cọ vệ sinh họng máy pha cà phê Espresso - Dụng Cụ Pha Chế Hà Nam tích hợp muỗng múc và chổi cứng hỗ trợ vệ sinh họng pha máy an toàn.',
    rating: 5.0,
    reviewCount: 4
  },
  {
    id: 'accessory-3',
    slug: 'giay-loc-ca-phe-hario-40-cai',
    name: 'Giấy lọc cà phê Hario 40 cái',
    price: 55000,
    originalPrice: null,
    image: '/img/giay_loc_hario_40_cai.jpg',
    gallery: [
      '/img/giay_loc_hario_40_cai.jpg',
      '/img/giay_loc_hario_v60_v01.jpg',
      '/img/giay_loc_khong_tay_trang.jpg'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'accessory',
    categoryName: 'Phụ kiện',
    groupName: '2. Giấy lọc & Phễu pha Pour-over',
    description: 'Tệp Giấy lọc cà phê Hario Nhật Bản 40 cái (V60-VCF-02-40W) làm từ bột giấy chất lượng cao của Nhật Bản, mang lại nước cà phê pour-over trong trẻo.',
    rating: 4.8,
    reviewCount: 1300
  },
  {
    id: 'accessory-4',
    slug: 'pheu-loc-ca-phe-v60-chiu-nhiet-da-dang-kich-co',
    name: 'Phễu Lọc Cà Phê V60 Chịu Nhiệt – Đa Dạng Kích Cỡ',
    price: 66000,
    originalPrice: null,
    image: '/img/pheu_loc_v60_chiu_nhiet.jpg',
    gallery: [
      '/img/pheu_loc_v60_chiu_nhiet.jpg',
      '/img/giay_loc_hario_40_cai.jpg'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'accessory',
    categoryName: 'Phụ kiện',
    groupName: '2. Giấy lọc & Phễu pha Pour-over',
    description: 'Mẫu Phễu Lọc Cà Phê V60 Chịu Nhiệt – Đa Dạng Kích Cỡ, Phù Hợp Mọi Gu Pha Chế sở hữu nhựa PVC chịu nhiệt bền bỉ cùng mức giá bình dân rất dễ tiếp cận.',
    rating: 4.8,
    reviewCount: 85
  },
  {
    id: 'accessory-5',
    slug: 'giay-loc-ca-phe-khong-tay-trang',
    name: 'Giấy Lọc Cà Phê Không Tẩy Trắng',
    price: 70000,
    originalPrice: null,
    image: '/img/giay_loc_khong_tay_trang.jpg',
    gallery: [
      '/img/giay_loc_khong_tay_trang.jpg',
      '/img/giay_loc_hario_40_cai.jpg'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'accessory',
    categoryName: 'Phụ kiện',
    groupName: '2. Giấy lọc & Phễu pha Pour-over',
    description: 'Giấy Lọc Cà Phê Không Tẩy Trắng chất liệu tự nhiên, an toàn cho sức khỏe và thân thiện với môi trường, tiết kiệm chi phí pha thủ công hàng ngày.',
    rating: 5.0,
    reviewCount: 4
  },
  {
    id: 'accessory-6',
    slug: 'giay-loc-ca-phe-hario-v60-v01',
    name: 'Giấy lọc cà phê Hario V60 V01',
    price: 115000,
    originalPrice: null,
    image: '/img/giay_loc_hario_v60_v01.jpg',
    gallery: [
      '/img/giay_loc_hario_v60_v01.jpg',
      '/img/giay_loc_hario_40_cai.jpg'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'accessory',
    categoryName: 'Phụ kiện',
    groupName: '2. Giấy lọc & Phễu pha Pour-over',
    description: 'Sản phẩm Giấy lọc cà phê Hario V60 V01 có kích thước chuẩn size 01, phù hợp chiết xuất 1 đến 2 tách cà phê cá nhân.',
    rating: 4.9,
    reviewCount: 62
  },
  {
    id: 'accessory-7',
    slug: 'mieng-lot-tamper-silicon-espresso-cho-may-pha-ca-phe',
    name: 'Miếng lót tamper silicon Espresso cho máy pha cà phê',
    price: 85000,
    originalPrice: null,
    image: '/img/mieng_lot_tamper_silicon.jpg',
    gallery: [
      '/img/mieng_lot_tamper_silicon.jpg',
      '/img/tamper_inox_58mm.jpg'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'accessory',
    categoryName: 'Phụ kiện',
    groupName: '3. Phụ kiện nén & Thao tác Espresso',
    description: 'Phụ kiện Miếng lót tamper silicon Espresso cho máy pha cà phê chế tạo từ silicon dày dặn chống trượt, giúp bảo vệ mặt bàn quầy pha chế khỏi trầy xước.',
    rating: 5.0,
    reviewCount: 3
  },
  {
    id: 'accessory-8',
    slug: 'the-green-coffee-tamper-nen-ca-phe-bang-inox-58mm',
    name: 'The Green Coffee - Tamper nén cà phê bằng inox -58mm',
    price: 190000,
    originalPrice: null,
    image: '/img/tamper_inox_58mm.jpg',
    gallery: [
      '/img/tamper_inox_58mm.jpg',
      '/img/mieng_lot_tamper_silicon.jpg'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'accessory',
    categoryName: 'Phụ kiện',
    groupName: '3. Phụ kiện nén & Thao tác Espresso',
    description: 'The Green Coffee - Tamper nén cà phê bằng inox -58mm chất liệu inox cao cấp đầm tay, đế phẳng giúp nén cà phê đều và nén chặt chuẩn kỹ thuật Espresso.',
    rating: 4.8,
    reviewCount: 42
  },
  {
    id: 'accessory-9',
    slug: 'pheu-v60-pha-ca-phe-hario-v60-coffee-dripper',
    name: 'Phễu V60 pha cà phê Hario V60 Coffee Dripper VDR-02 size 02 (phễu nhựa, 2 màu) - Đỏ - Size 01',
    price: 155000,
    originalPrice: null,
    image: '/img/pheu_v60_hario_vdr02.jpg',
    gallery: [
      '/img/pheu_v60_hario_vdr02.jpg',
      '/img/pheu_pha_ca_phe_hario_nhat_ban.jpg'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'accessory',
    categoryName: 'Phụ kiện',
    groupName: '2. Giấy lọc & Phễu pha Pour-over',
    description: 'Dụng cụ Phễu V60 pha cà phê Hario V60 Coffee Dripper VDR-02 size 02 (phễu nhựa, 2 màu) - Đỏ - Size 01 sử dụng rãnh xoắn ốc đối lưu chuẩn Nhật Bản, giữ nhiệt độ ổn định khi chiết xuất.',
    rating: 4.8,
    reviewCount: 543
  },
  {
    id: 'accessory-10',
    slug: 'pheu-pha-ca-phe-hario-nhat-ban',
    name: 'Phễu pha cà phê Hario Nhật Bản',
    price: 285000,
    originalPrice: null,
    image: '/img/pheu_pha_ca_phe_hario_nhat_ban.jpg',
    gallery: [
      '/img/pheu_pha_ca_phe_hario_nhat_ban.jpg',
      '/img/pheu_v60_hario_vdr02.jpg'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'accessory',
    categoryName: 'Phụ kiện',
    groupName: '2. Giấy lọc & Phễu pha Pour-over',
    description: 'Phễu pha cà phê Hario Nhật Bản thiết kế hình vương miện tinh tế, chất liệu cao cấp chịu nhiệt, chiết xuất cà phê Pour-over chuẩn vị thơm ngon.',
    rating: 4.9,
    reviewCount: 176
  },

  // Nhóm 4: Máy xay cà phê tay (Hạt sang bột)
  {
    id: 'grinder-1',
    slug: 'may-xay-ca-phe-co-dien-sionreaipa',
    name: 'Máy Xay Cà Phê Cổ Điển SIONREAIPA',
    price: 293800,
    originalPrice: null,
    image: '/img/may_xay_co_dien_sionreaipa.jpg',
    gallery: [
      '/img/may_xay_co_dien_sionreaipa.jpg',
      '/img/may_xay_quay_tay_mongdio.jpg',
      '/img/moka_bialetti_brikka.jpg'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'grinder',
    categoryName: 'Máy xay cafe cầm tay',
    groupName: 'Nhóm 4: Máy xay cà phê tay (Hạt sang bột)',
    description: 'Mẫu Máy Xay Cà Phê Cổ Điển SIONREAIPA, Máy Xay Cà Phê Quay Tay Bằng Tay Burr, Lõi Mài Gốm Gỗ Có Thể Điều Chỉnh Kích Thước Hạt Máy Xay Cà Phê Gia Đình sở hữu vỏ gỗ phong cách vintage cùng lõi nghiền gốm điều chỉnh được độ mịn thô.',
    rating: 4.8,
    reviewCount: 98
  },
  {
    id: 'grinder-2',
    slug: 'mongdio-may-xay-ca-phe-quay-tay',
    name: 'MONGDIO | Máy Xay Cà Phê Quay Tay',
    price: 319000,
    originalPrice: null,
    image: '/img/may_xay_quay_tay_mongdio.jpg',
    gallery: [
      '/img/may_xay_quay_tay_mongdio.jpg',
      '/img/may_xay_co_dien_sionreaipa.jpg',
      '/img/french_press_bodum_chambord.jpg'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'grinder',
    categoryName: 'Máy xay cafe cầm tay',
    groupName: 'Nhóm 4: Máy xay cà phê tay (Hạt sang bột)',
    description: 'MONGDIO Máy Xay Cà Phê Quay Tay thiết kế bánh đà cổ điển cao cấp, cối xay lõi gang đúc bền bỉ kết hợp hộp đựng gỗ phong cách hoài niệm.',
    rating: 4.9,
    reviewCount: 112
  },

  // Phân khúc nhập môn & Du lịch
  {
    id: 'grinder-3',
    slug: 'coi-xay-ca-phe-1zpresso-q-air',
    name: 'CỐI XAY CÀ PHÊ CẦM TAY 1ZPRESSO Q AIR LƯỠI 7 CÁNH - Tặng kèm 100g cà phê',
    price: 1600000,
    originalPrice: null,
    image: '/img/coi_xay_1zpresso_q_air.jpg',
    gallery: [
      '/img/coi_xay_1zpresso_q_air.jpg',
      '/img/timemore_c3_esp_pro.jpg',
      '/img/1zpresso_k_plus.jpg'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'grinder',
    categoryName: 'Máy xay cafe cầm tay',
    groupName: 'Phân khúc nhập môn & Du lịch (Gọn nhẹ, giá mềm)',
    description: '1Zpresso Q Air lưỡi xay 38mm 7 cánh thép không gỉ giúp xay dễ dàng hơn, chuyên dụng xay pha Phin, Pour over, Cold brew. Bản nhỏ gọn 2024.',
    rating: 5.0,
    reviewCount: 5
  },

  // Phân khúc tầm trung
  {
    id: 'grinder-4',
    slug: 'timemore-c3-esp-pro',
    name: 'Timemore C3 ESP PRO',
    price: 1890000,
    originalPrice: null,
    image: '/img/timemore_c3_esp_pro.jpg',
    gallery: [
      '/img/timemore_c3_esp_pro.jpg',
      '/img/timemore_s3_flagship_2025.jpg',
      '/img/coi_xay_1zpresso_q_air.jpg'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'grinder',
    categoryName: 'Máy xay cafe cầm tay',
    groupName: 'Phân khúc tầm trung (Kim loại nguyên khối, đa dụng)',
    description: 'Dòng Cối xay cà phê Timemore C3 ESP Pro trang bị đĩa mài côn S2C 38mm cùng tay cầm gấp gọn, đáp ứng tốt độ mịn từ Espresso đến French Press.',
    rating: 4.7,
    reviewCount: 505
  },

  // Phân khúc cao cấp
  {
    id: 'grinder-5',
    slug: 'timemore-s3-flagship-2025',
    name: 'Cối xay cà phê Timemore S3 | Flagship 2025',
    price: 2950000,
    originalPrice: null,
    image: '/img/timemore_s3_flagship_2025.jpg',
    gallery: [
      '/img/timemore_s3_flagship_2025.jpg',
      '/img/1zpresso_k_plus.jpg',
      '/img/timemore_c3_esp_pro.jpg'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'grinder',
    categoryName: 'Máy xay cafe cầm tay',
    groupName: 'Phân khúc cao cấp (Vi chỉnh chính xác bên ngoài)',
    description: 'Mẫu flagship Cối xay cà phê Timemore S3 Flagship 2025 sở hữu vòng xoay chỉnh cỡ bên ngoài chuẩn xác 0,015mm mỗi nấc cùng đĩa xay S2C890 cao cấp.',
    rating: 4.7,
    reviewCount: 53
  },
  {
    id: 'grinder-6',
    slug: '1zpresso-k-plus-coi-xay-ca-phe-tay-cao-cap',
    name: '1Zpresso K-Plus - Cối xay cà phê tay cao cấp',
    price: 5350000,
    originalPrice: null,
    image: '/img/1zpresso_k_plus.jpg',
    gallery: [
      '/img/1zpresso_k_plus.jpg',
      '/img/timemore_s3_flagship_2025.jpg',
      '/img/timemore_c3_esp_pro.jpg'
    ],
    isOutOfStock: false,
    stockQuantity: 25,
    category: 'grinder',
    categoryName: 'Máy xay cafe cầm tay',
    groupName: 'Phân khúc cao cấp (Vi chỉnh chính xác bên ngoài)',
    description: 'Chiếc 1Zpresso K-Plus - Cối xay cà phê tay cao cấp nổi bật với vành chỉnh 90 click đánh số, độ chính xác vượt trội cho mọi phương pháp pha từ Espresso đến Pour-over.',
    rating: 4.9,
    reviewCount: 46
  }
];

export const ALL_PRODUCTS = [
  ...PACKAGED_PRODUCTS,
  ...EQUIPMENT_PRODUCTS
];

// Normalize helper to compare strings without accents or punctuation
function normalizeStr(str) {
  return String(str || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, '');
}

// Helper to find a product by ID, slug, or name
export function findProduct(identifier) {
  if (!identifier) return null;
  const raw = String(identifier).trim().toLowerCase();
  const normalized = normalizeStr(identifier);

  // 1. Direct match by id or slug
  const directMatch = ALL_PRODUCTS.find(
    (p) =>
      p.id.toLowerCase() === raw ||
      (p.slug && p.slug.toLowerCase() === raw)
  );
  if (directMatch) return directMatch;

  // 2. Specific Aliases Mapping
  const aliasMap = {
    // Menu drinks aliases
    'combo1': 'sig-1',
    'fav1': 'sig-1',
    'sug1': 'sig-1',
    'cafedennong': 'sig-1',
    'productcafedennong': 'sig-1',

    'combo2': 'sig-4',
    'fav2': 'sig-4',
    'sug2': 'sig-4',
    'cafemuoi': 'sig-4',
    'productcafemuoi': 'sig-4',

    'combo3': 'sig-2',
    'fav3': 'sig-2',
    'sug3': 'sig-2',
    'cafesuada': 'sig-2',
    'productcafesuada': 'sig-2',

    'combo4': 'sig-5',
    'fav4': 'sig-5',
    'sug4': 'sig-5',
    'cafesuanong': 'sig-5',
    'productcafesuanong': 'sig-5',

    'combo5': 'sig-3',
    'fav5': 'sig-3',
    'sug5': 'sig-3',
    'capuchino': 'sig-3',
    'productcapuchino': 'sig-3',

    'combo6': 'sig-6',
    'fav6': 'sig-6',
    'sug6': 'sig-6',
    'cookiedaxay': 'sig-6',
    'productcookiedaxay': 'sig-6',

    // Packaged coffee aliases
    'cafe1': 'packaged-1',
    'caphedonggoi1': 'packaged-1',
    'packaged1': 'packaged-1',

    'cafe2': 'packaged-2',
    'caphedonggoi2': 'packaged-2',
    'packaged2': 'packaged-2',

    'cafe3': 'packaged-3',
    'caphedonggoi3': 'packaged-3',
    'packaged3': 'packaged-3',

    'cafe4': 'packaged-4',
    'caphedonggoi4': 'packaged-4',
    'packaged4': 'packaged-4',

    'cafe5': 'packaged-5',
    'caphedonggoi5': 'packaged-5',
    'packaged5': 'packaged-5',

    'cafe6': 'packaged-6',
    'caphedonggoi6': 'packaged-6',
    'packaged6': 'packaged-6',

    // Equipment aliases
    'bialettibrikkacamung4coc': 'equipment-1',
    'bialetti': 'equipment-1',
    'mokabialetti': 'equipment-1',
    'amphacaphemokapotbangnhom': 'equipment-2',
    'mokapot': 'equipment-2',
    'binhphacaphebodumcocchambord': 'equipment-3',
    'bodum': 'equipment-3',
    'frenchpressbodum': 'equipment-3',
    'llg018': 'equipment-4',
    'frenchpresslocknlock': 'equipment-4',

    // Accessory aliases
    'choivesinhmaypha': 'accessory-1',
    'choivesinhcango': 'accessory-1',
    'covesinhhongmay': 'accessory-2',
    'giaylochario40cai': 'accessory-3',
    'giayloc40cai': 'accessory-3',
    'pheulocv60chiunhiet': 'accessory-4',
    'pheulocv60': 'accessory-4',
    'giaylockhongtaytrang': 'accessory-5',
    'giaylochariov60v01': 'accessory-6',
    'giaylochariov01': 'accessory-6',
    'miengrottampersilicon': 'accessory-7',
    'mienglottamper': 'accessory-7',
    'thegreencoffeetamper': 'accessory-8',
    'tamperinox58mm': 'accessory-8',
    'pheuv60': 'accessory-9',
    'hariov60': 'accessory-9',
    'pheuphacaphehario': 'accessory-10',

    // Grinder aliases
    'mayxaycaphecodiensionreaipa': 'grinder-1',
    'sionreaipa': 'grinder-1',
    'mongdio': 'grinder-2',
    'mongdiomayxaycaphequaytay': 'grinder-2',
    '1zpressoqair': 'grinder-3',
    'coixaycaphecamtay1zpressoqair': 'grinder-3',
    'timorec3esppro': 'grinder-4',
    'timemorec3esppro': 'grinder-4',
    'timemores3': 'grinder-5',
    'timemores3flagship2025': 'grinder-5',
    '1zpressokplus': 'grinder-6',
    '1zpressokpluscoi': 'grinder-6'
  };

  const targetId = aliasMap[normalized];
  if (targetId) {
    const found = ALL_PRODUCTS.find((p) => p.id === targetId);
    if (found) return found;
  }

  // 3. Match by normalized name
  const nameMatch = ALL_PRODUCTS.find(
    (p) => normalizeStr(p.name) === normalized
  );
  if (nameMatch) return nameMatch;

  // 4. Substring partial match if unique
  const partial = ALL_PRODUCTS.find(
    (p) => normalizeStr(p.name).includes(normalized) || normalized.includes(normalizeStr(p.name))
  );
  if (partial) return partial;

  return null;
}

export function formatVND(amount) {
  if (amount == null) return '';
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}
