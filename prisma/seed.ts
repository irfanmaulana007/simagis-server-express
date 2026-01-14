import {
  MenuEnum,
  ModuleEnum,
  PaymentMethodEnum,
  PaymentTypeEnum,
  PriceTypeEnum,
  PrismaClient,
  RefundMethodEnum,
  RoleEnum,
  StatusEnum,
  SubMenuEnum,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedBanks() {
  console.log('Seeding banks...');
  await prisma.bank.createMany({
    skipDuplicates: true,
    data: [
      { code: '002', name: 'Bank BRI' },
      { code: '008', name: 'Bank Mandiri' },
      { code: '009', name: 'Bank BNI' },
      { code: '011', name: 'Bank Danamon' },
      { code: '013', name: 'Bank Permata' },
      { code: '014', name: 'Bank BCA' },
      { code: '016', name: 'Bank Maybank Indonesia' },
      { code: '019', name: 'Bank Panin' },
      { code: '022', name: 'CIMB Niaga' },
      { code: '023', name: 'Bank UOB Indonesia' },
      { code: '028', name: 'Bank OCBC NISP' },
      { code: '031', name: 'Citi Bank' },
      { code: '036', name: 'Bank CCB' },
      { code: '037', name: 'Bank Artha Graha' },
      { code: '042', name: 'Bank MUFG Bank' },
      { code: '046', name: 'Bank DBS' },
      { code: '050', name: 'Standard Chartered Bank' },
      { code: '054', name: 'Bank Capital' },
      { code: '061', name: 'ANZ Indonesia' },
      { code: '069', name: 'Bank of China ' },
      { code: '076', name: 'Bank Bumi Arta' },
      { code: '087', name: 'Bank HSBC Indonesia' },
      { code: '089', name: 'Bank RABOBANK' },
      { code: '095', name: 'Bank JTrust Indonesia' },
      { code: '097', name: 'Bank Mayapada' },
      { code: '110', name: 'Bank BJB' },
      { code: '111', name: 'Bank DKI' },
      { code: '112', name: 'Bank BPD DIY' },
      { code: '113', name: 'Bank Jateng' },
      { code: '114', name: 'Bank Jatim' },
      { code: '115', name: 'Bank Jambi' },
      { code: '116', name: 'Bank Aceh' },
      { code: '117', name: 'Bank Sumut' },
      { code: '118', name: 'Bank Nagari' },
      { code: '119', name: 'Bank Riau Kepri' },
      { code: '120', name: 'Bank Sumsel Babel' },
      { code: '121', name: 'Bank Lampung' },
      { code: '122', name: 'Bank Kalsel' },
      { code: '123', name: 'Bank Kalbar' },
      { code: '124', name: 'Bank Kaltimtara' },
      { code: '125', name: 'Bank Kalteng' },
      { code: '126', name: 'Bank Sulselbar' },
      { code: '127', name: 'Bank Sulut Go' },
      { code: '128', name: 'Bank NTB Syariah' },
      { code: '129', name: 'Bank BPD Bali' },
      { code: '130', name: 'Bank NTT' },
      { code: '131', name: 'Bank Maluku Malut' },
      { code: '132', name: 'Bank Papua' },
      { code: '133', name: 'Bank Bengkulu' },
      { code: '134', name: 'Bank Sulteng' },
      { code: '135', name: 'Bank Sultra' },
      { code: '137', name: 'Bank Banten' },
      { code: '146', name: 'Bank of India Indonesia' },
      { code: '147', name: 'Bank Muamalat Indonesia' },
      { code: '151', name: 'Bank Mestika' },
      { code: '152', name: 'Bank Shinhan Indonesia' },
      { code: '153', name: 'Bank SINARMAS' },
      { code: '157', name: 'Bank Maspion Indonesia' },
      { code: '161', name: 'Bank Ganesha' },
      { code: '164', name: 'Bank ICBC Indonesia' },
      { code: '167', name: 'Bank QNB Indonesia' },
      { code: '200', name: 'Bank BTN' },
      { code: '212', name: 'Bank Woori Saudara' },
      { code: '213', name: 'Bank BTPN' },
      { code: '405', name: 'Bank Victoria Syariah' },
      { code: '422', name: 'Bank BRI Syariah' },
      { code: '425', name: 'Bank BJB Syariah' },
      { code: '426', name: 'Bank Mega' },
      { code: '427', name: 'Bank BNI Syariah' },
      { code: '441', name: 'Bank Bukopin' },
      { code: '451', name: 'Bank Syariah Mandiri' },
      { code: '472', name: 'Bank Jasa Jakarta' },
      { code: '484', name: 'Bank KEB Hana' },
      { code: '485', name: 'MNC Bank' },
      { code: '490', name: 'Bank Neo Commerce' },
      { code: '494', name: 'Bank BRI Agroniaga' },
      { code: '498', name: 'Bank SBI' },
      { code: '503', name: 'Bank Nobu' },
      { code: '506', name: 'Bank Mega Syariah' },
      { code: '513', name: 'Bank Ina Perdana' },
      { code: '517', name: 'Bank Panin Dubai Syariah' },
      { code: '520', name: 'Bank Prima Master' },
      { code: '521', name: 'Bank Syariah Bukopin' },
      { code: '523', name: 'Bank Sahabat Sampoerna' },
      { code: '526', name: 'Bank DINAR Indonesia' },
      { code: '535', name: 'Bank Kesejahteraan Ekonomi' },
      { code: '536', name: 'Bank BCA Syariah' },
      { code: '542', name: 'Bank ARTOS Indonesia' },
      { code: '547', name: 'Bank BPTN Syariah' },
      { code: '548', name: 'Bank Multiarta Sentosa' },
      { code: '553', name: 'Bank Mayora' },
      { code: '555', name: 'Bank Index Selindo' },
      { code: '564', name: 'Bank Sinar Harapan Bali' },
      { code: '566', name: 'Bank Victoria Internasional' },
      { code: '567', name: 'Bank Harda Internasional' },
      { code: '600', name: 'BPR/LSB' },
      { code: '688', name: 'BPR KS' },
      { code: '699', name: 'BPR EKA' },
      { code: '789', name: 'Indosat (Dompetku)' },
      { code: '911', name: 'Telkomsel (TCASH)' },
      { code: '945', name: 'Bank AGRIS' },
      { code: '949', name: 'Bank ChinaTrust Indonesia' },
      { code: '950', name: 'Bank Commonwealth' },
    ],
  });
}

async function seedColors() {
  console.log('Seeding colors...');
  await prisma.color.createMany({
    skipDuplicates: true,
    data: [
      { code: 'BLK', name: 'Black' },
      { code: 'WHT', name: 'White' },
      { code: 'RED', name: 'Red' },
      { code: 'BLU', name: 'Blue' },
      { code: 'GRN', name: 'Green' },
      { code: 'YLW', name: 'Yellow' },
      { code: 'ORG', name: 'Orange' },
      { code: 'PNK', name: 'Pink' },
      { code: 'PRP', name: 'Purple' },
      { code: 'BRN', name: 'Brown' },
      { code: 'GRY', name: 'Grey' },
      { code: 'NVY', name: 'Navy' },
      { code: 'BGE', name: 'Beige' },
      { code: 'CRM', name: 'Cream' },
      { code: 'GLD', name: 'Gold' },
      { code: 'SLV', name: 'Silver' },
      { code: 'MRN', name: 'Maroon' },
      { code: 'TRQ', name: 'Turquoise' },
      { code: 'CRL', name: 'Coral' },
      { code: 'KHK', name: 'Khaki' },
    ],
  });
}

async function seedReimbursementTypes() {
  console.log('Seeding reimbursement types...');
  await prisma.reimbursementType.createMany({
    skipDuplicates: true,
    data: [
      { code: 'TRP', name: 'Transportation' },
      { code: 'ACM', name: 'Accommodation' },
      { code: 'MLT', name: 'Meals' },
      { code: 'OFC', name: 'Office Supplies' },
      { code: 'TRN', name: 'Training' },
      { code: 'MED', name: 'Medical' },
      { code: 'COM', name: 'Communication' },
      { code: 'OTH', name: 'Others' },
    ],
  });
}

async function seedCekGiroFailStatuses() {
  console.log('Seeding cek giro fail statuses...');
  await prisma.cekGiroFailStatus.createMany({
    skipDuplicates: true,
    data: [
      { code: 'ISF', name: 'Insufficient Funds' },
      { code: 'ACC', name: 'Account Closed' },
      { code: 'SIG', name: 'Signature Mismatch' },
      { code: 'STL', name: 'Stale Dated' },
      { code: 'PSD', name: 'Post Dated' },
      { code: 'FRD', name: 'Fraud Suspected' },
      { code: 'OTH', name: 'Others' },
    ],
  });
}

async function seedUsers() {
  console.log('Seeding users...');

  const users = [
    {
      code: 'USRJKT0001',
      name: 'Super Admin',
      password: bcrypt.hashSync('asdf', 12),
      username: 'superadmin',
      address: 'Jakarta Pusat',
      balance: 0,
      discountLimit: 100,
      expenseLimit: 10000000,
      email: 'superadmin@simagis.com',
      phone: '08000000001',
      role: RoleEnum.SUPER_ADMIN,
    },
    {
      code: 'USRJKT0002',
      name: 'Owner Utama',
      password: bcrypt.hashSync('asdf', 12),
      username: 'owner',
      address: 'Jakarta Selatan',
      balance: 0,
      discountLimit: 100,
      expenseLimit: 50000000,
      email: 'owner@simagis.com',
      phone: '08000000002',
      role: RoleEnum.OWNER,
    },
    {
      code: 'USRJKT0003',
      name: 'Pimpinan Cabang',
      password: bcrypt.hashSync('asdf', 12),
      username: 'pimpinan',
      address: 'Jakarta Barat',
      balance: 0,
      discountLimit: 50,
      expenseLimit: 5000000,
      email: 'pimpinan@simagis.com',
      phone: '08000000003',
      role: RoleEnum.PIMPINAN,
    },
    {
      code: 'USRJKT0004',
      name: 'Kasir Toko',
      password: bcrypt.hashSync('asdf', 12),
      username: 'kasir',
      address: 'Jakarta Timur',
      balance: 0,
      discountLimit: 10,
      expenseLimit: 500000,
      email: 'kasir@simagis.com',
      phone: '08000000004',
      role: RoleEnum.KASIR,
    },
    {
      code: 'USRJKT0005',
      name: 'Sales Marketing',
      password: bcrypt.hashSync('asdf', 12),
      username: 'sales',
      address: 'Jakarta Utara',
      balance: 100000,
      discountLimit: 20,
      expenseLimit: 1000000,
      email: 'sales@simagis.com',
      phone: '08000000005',
      role: RoleEnum.SALES,
    },
    {
      code: 'USRJKT0006',
      name: 'Staff Inventory',
      password: bcrypt.hashSync('asdf', 12),
      username: 'inventory',
      address: 'Tangerang',
      balance: 0,
      discountLimit: 0,
      expenseLimit: 500000,
      email: 'inventory@simagis.com',
      phone: '08000000006',
      role: RoleEnum.STAFF_INVENTORY,
    },
    {
      code: 'USRJKT0007',
      name: 'Staff Warehouse',
      password: bcrypt.hashSync('asdf', 12),
      username: 'warehouse',
      address: 'Bekasi',
      balance: 0,
      discountLimit: 0,
      expenseLimit: 500000,
      email: 'warehouse@simagis.com',
      phone: '08000000007',
      role: RoleEnum.STAFF_WAREHOUSE,
    },
    {
      code: 'USRJKT0008',
      name: 'Staff Kantor',
      password: bcrypt.hashSync('asdf', 12),
      username: 'staffkantor',
      address: 'Depok',
      balance: 0,
      discountLimit: 5,
      expenseLimit: 500000,
      email: 'staffkantor@simagis.com',
      phone: '08000000008',
      role: RoleEnum.STAFF_KANTOR,
    },
    {
      code: 'USRJKT0009',
      name: 'Head Kantor',
      password: bcrypt.hashSync('asdf', 12),
      username: 'headkantor',
      address: 'Bogor',
      balance: 0,
      discountLimit: 30,
      expenseLimit: 3000000,
      email: 'headkantor@simagis.com',
      phone: '08000000009',
      role: RoleEnum.HEAD_KANTOR,
    },
    {
      code: 'USRJKT0010',
      name: 'Anggota Toko',
      password: bcrypt.hashSync('asdf', 12),
      username: 'anggota',
      address: 'Cikarang',
      balance: 50000,
      discountLimit: 5,
      expenseLimit: 0,
      email: 'anggota@simagis.com',
      phone: '08000000010',
      role: RoleEnum.ANGGOTA,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { code: user.code },
      update: {},
      create: user,
    });
  }
}

async function seedBranches() {
  console.log('Seeding branches...');

  const branches = [
    {
      code: 'JKT',
      address: 'Jl. Sudirman No. 1, Jakarta Pusat',
      name: 'Jakarta Pusat',
      phone: '021-1234567',
      priceType: PriceTypeEnum.ECER,
      depreciationYear1: 10,
      depreciationYear2: 15,
      depreciationYear3: 20,
      depreciationYear4: 25,
    },
    {
      code: 'BDG',
      address: 'Jl. Asia Afrika No. 10, Bandung',
      name: 'Bandung',
      phone: '022-7654321',
      priceType: PriceTypeEnum.GROSIR,
      depreciationYear1: 10,
      depreciationYear2: 15,
      depreciationYear3: 20,
      depreciationYear4: 25,
    },
    {
      code: 'SBY',
      address: 'Jl. Tunjungan No. 5, Surabaya',
      name: 'Surabaya',
      phone: '031-9876543',
      priceType: PriceTypeEnum.ECER,
      depreciationYear1: 10,
      depreciationYear2: 15,
      depreciationYear3: 20,
      depreciationYear4: 25,
    },
    {
      code: 'YOG',
      address: 'Jl. Malioboro No. 100, Yogyakarta',
      name: 'Yogyakarta',
      phone: '0274-123456',
      priceType: PriceTypeEnum.GROSIR,
      depreciationYear1: 10,
      depreciationYear2: 15,
      depreciationYear3: 20,
      depreciationYear4: 25,
    },
  ];

  for (const branch of branches) {
    await prisma.branch.upsert({
      where: { code: branch.code },
      update: {},
      create: branch,
    });
  }
}

async function seedUserBranchDetails() {
  console.log('Seeding user branch details...');
  const userBranchDetails = [
    { branchCode: 'JKT', userCode: 'USRJKT0001' },
    { branchCode: 'JKT', userCode: 'USRJKT0002' },
    { branchCode: 'JKT', userCode: 'USRJKT0003' },
    { branchCode: 'JKT', userCode: 'USRJKT0004' },
    { branchCode: 'JKT', userCode: 'USRJKT0005' },
    { branchCode: 'JKT', userCode: 'USRJKT0006' },
    { branchCode: 'BDG', userCode: 'USRJKT0007' },
    { branchCode: 'BDG', userCode: 'USRJKT0008' },
    { branchCode: 'SBY', userCode: 'USRJKT0009' },
    { branchCode: 'YOG', userCode: 'USRJKT0010' },
  ];

  for (const detail of userBranchDetails) {
    const existing = await prisma.userBranchDetail.findFirst({
      where: { branchCode: detail.branchCode, userCode: detail.userCode },
    });
    if (!existing) {
      await prisma.userBranchDetail.create({ data: detail });
    }
  }
}

async function seedExpenseCategories() {
  console.log('Seeding expense categories...');
  const categories = [
    { code: 'EXPJKT0001', branchCode: 'JKT', name: 'Listrik' },
    { code: 'EXPJKT0002', branchCode: 'JKT', name: 'Air' },
    { code: 'EXPJKT0003', branchCode: 'JKT', name: 'Internet' },
    { code: 'EXPJKT0004', branchCode: 'JKT', name: 'Gaji Karyawan' },
    { code: 'EXPJKT0005', branchCode: 'JKT', name: 'Sewa Gedung' },
    { code: 'EXPJKT0006', branchCode: 'JKT', name: 'Transportasi' },
    { code: 'EXPJKT0007', branchCode: 'JKT', name: 'Pemeliharaan' },
    { code: 'EXPJKT0008', branchCode: 'JKT', name: 'ATK' },
    { code: 'EXPBDG0001', branchCode: 'BDG', name: 'Listrik' },
    { code: 'EXPBDG0002', branchCode: 'BDG', name: 'Air' },
    { code: 'EXPBDG0003', branchCode: 'BDG', name: 'Internet' },
    { code: 'EXPSBY0001', branchCode: 'SBY', name: 'Listrik' },
    { code: 'EXBYOG0001', branchCode: 'YOG', name: 'Listrik' },
  ];

  for (const cat of categories) {
    await prisma.expenseCategory.upsert({
      where: { code: cat.code },
      update: {},
      create: cat,
    });
  }
}

async function seedMembers() {
  console.log('Seeding members...');
  const members = [
    {
      code: 'MBRJKT000000001',
      branchCode: 'JKT',
      name: 'Toko Maju Jaya',
      location: 'Pasar Tanah Abang Blok A Lt. 2 No. 15',
      email: 'majujaya@gmail.com',
      debt: 0,
      debtLimit: 10000000,
    },
    {
      code: 'MBRJKT000000002',
      branchCode: 'JKT',
      name: 'Toko Berkah Sentosa',
      location: 'Pasar Tanah Abang Blok B Lt. 1 No. 20',
      email: 'berkahsentosa@gmail.com',
      debt: 500000,
      debtLimit: 5000000,
    },
    {
      code: 'MBRJKT000000003',
      branchCode: 'JKT',
      name: 'Toko Sinar Terang',
      location: 'Pasar Senen Blok C No. 10',
      email: 'sinarterang@gmail.com',
      debt: 1500000,
      debtLimit: 8000000,
    },
    {
      code: 'MBRBDG000000001',
      branchCode: 'BDG',
      name: 'Toko Bandung Indah',
      location: 'Pasar Baru Bandung Lt. 1 No. 5',
      email: 'bandungindah@gmail.com',
      debt: 0,
      debtLimit: 15000000,
    },
    {
      code: 'MBRSBY000000001',
      branchCode: 'SBY',
      name: 'Toko Surabaya Makmur',
      location: 'Pasar Kapasan No. 25',
      email: 'surabayamakmur@gmail.com',
      debt: 2000000,
      debtLimit: 20000000,
    },
  ];

  for (const member of members) {
    await prisma.member.upsert({
      where: { code: member.code },
      update: {},
      create: member,
    });
  }
}

async function seedPhones() {
  console.log('Seeding phones...');
  const phones = [
    { module: ModuleEnum.MEMBER, ownerCode: 'MBRJKT000000001', phone: '081234567001' },
    { module: ModuleEnum.MEMBER, ownerCode: 'MBRJKT000000001', phone: '081234567002' },
    { module: ModuleEnum.MEMBER, ownerCode: 'MBRJKT000000002', phone: '081234567003' },
    { module: ModuleEnum.MEMBER, ownerCode: 'MBRBDG000000001', phone: '081234567004' },
    { module: ModuleEnum.SUPPLIER, ownerCode: 'SUPJKT00000001', phone: '081234567005' },
    { module: ModuleEnum.SUPPLIER, ownerCode: 'SUPJKT00000002', phone: '081234567006' },
  ];

  for (const phone of phones) {
    const existing = await prisma.phone.findUnique({ where: { phone: phone.phone } });
    if (!existing) {
      await prisma.phone.create({ data: phone });
    }
  }
}

async function seedProductCategories() {
  console.log('Seeding product categories...');
  const categories = [
    {
      code: 'CATJKT00000001',
      branchCode: 'JKT',
      name: 'Sepatu Pria',
      depreciationYear1: 10,
      depreciationYear2: 15,
      depreciationYear3: 20,
      depreciationYear4: 25,
    },
    {
      code: 'CATJKT00000002',
      branchCode: 'JKT',
      name: 'Sepatu Wanita',
      depreciationYear1: 10,
      depreciationYear2: 15,
      depreciationYear3: 20,
      depreciationYear4: 25,
    },
    {
      code: 'CATJKT00000003',
      branchCode: 'JKT',
      name: 'Sandal Pria',
      depreciationYear1: 10,
      depreciationYear2: 15,
      depreciationYear3: 20,
      depreciationYear4: 25,
    },
    {
      code: 'CATJKT00000004',
      branchCode: 'JKT',
      name: 'Sandal Wanita',
      depreciationYear1: 10,
      depreciationYear2: 15,
      depreciationYear3: 20,
      depreciationYear4: 25,
    },
    {
      code: 'CATJKT00000005',
      branchCode: 'JKT',
      name: 'Tas Pria',
      depreciationYear1: 10,
      depreciationYear2: 15,
      depreciationYear3: 20,
      depreciationYear4: 25,
    },
    {
      code: 'CATJKT00000006',
      branchCode: 'JKT',
      name: 'Tas Wanita',
      depreciationYear1: 10,
      depreciationYear2: 15,
      depreciationYear3: 20,
      depreciationYear4: 25,
    },
    {
      code: 'CATBDG00000001',
      branchCode: 'BDG',
      name: 'Sepatu Pria',
      depreciationYear1: 10,
      depreciationYear2: 15,
      depreciationYear3: 20,
      depreciationYear4: 25,
    },
    {
      code: 'CATBDG00000002',
      branchCode: 'BDG',
      name: 'Sepatu Wanita',
      depreciationYear1: 10,
      depreciationYear2: 15,
      depreciationYear3: 20,
      depreciationYear4: 25,
    },
  ];

  for (const cat of categories) {
    await prisma.productCategory.upsert({
      where: { code: cat.code },
      update: {},
      create: cat,
    });
  }
}

async function seedSuppliers() {
  console.log('Seeding suppliers...');
  const suppliers = [
    {
      code: 'SUPJKT00000001',
      branchCode: 'JKT',
      name: 'PT Sepatu Indonesia',
      address: 'Kawasan Industri Pulogadung Blok A No. 10',
    },
    {
      code: 'SUPJKT00000002',
      branchCode: 'JKT',
      name: 'CV Sandal Makmur',
      address: 'Kawasan Industri Cakung No. 25',
    },
    {
      code: 'SUPJKT00000003',
      branchCode: 'JKT',
      name: 'PT Tas Berkualitas',
      address: 'Kawasan Industri MM2100 Blok B No. 5',
    },
    {
      code: 'SUPBDG00000001',
      branchCode: 'BDG',
      name: 'CV Sepatu Bandung',
      address: 'Kawasan Industri Cimahi No. 15',
    },
    {
      code: 'SUPSBY00000001',
      branchCode: 'SBY',
      name: 'PT Alas Kaki Surabaya',
      address: 'Kawasan Industri SIER No. 30',
    },
  ];

  for (const supplier of suppliers) {
    await prisma.supplier.upsert({
      where: { code: supplier.code },
      update: {},
      create: supplier,
    });
  }
}

async function seedSupplierDiscounts() {
  console.log('Seeding supplier discounts...');
  const discounts = [
    {
      code: 'SDJKT000000001',
      supplierCode: 'SUPJKT00000001',
      name: 'Diskon Kuantitas',
      percentage: 5,
      validDate: new Date('2025-12-31'),
    },
    {
      code: 'SDJKT000000002',
      supplierCode: 'SUPJKT00000001',
      name: 'Diskon Akhir Tahun',
      percentage: 10,
      validDate: new Date('2025-12-31'),
    },
    {
      code: 'SDJKT000000003',
      supplierCode: 'SUPJKT00000002',
      name: 'Diskon Member',
      amount: 50000,
      validDate: new Date('2025-06-30'),
    },
    {
      code: 'SDBDG000000001',
      supplierCode: 'SUPBDG00000001',
      name: 'Diskon Spesial',
      percentage: 7,
      validDate: new Date('2025-09-30'),
    },
  ];

  for (const discount of discounts) {
    await prisma.supplierDiscount.upsert({
      where: { code: discount.code },
      update: {},
      create: discount,
    });
  }
}

async function seedProducts() {
  console.log('Seeding products...');
  const products = [
    { code: 'PRDJKT00000001', branchCode: 'JKT', productCategoryCode: 'CATJKT00000001', name: 'Sepatu Kulit Formal' },
    { code: 'PRDJKT00000002', branchCode: 'JKT', productCategoryCode: 'CATJKT00000001', name: 'Sepatu Sneakers Casual' },
    { code: 'PRDJKT00000003', branchCode: 'JKT', productCategoryCode: 'CATJKT00000001', name: 'Sepatu Olahraga Running' },
    { code: 'PRDJKT00000004', branchCode: 'JKT', productCategoryCode: 'CATJKT00000002', name: 'High Heels Pesta' },
    { code: 'PRDJKT00000005', branchCode: 'JKT', productCategoryCode: 'CATJKT00000002', name: 'Flat Shoes Casual' },
    { code: 'PRDJKT00000006', branchCode: 'JKT', productCategoryCode: 'CATJKT00000003', name: 'Sandal Gunung' },
    { code: 'PRDJKT00000007', branchCode: 'JKT', productCategoryCode: 'CATJKT00000004', name: 'Sandal Jepit Premium' },
    { code: 'PRDJKT00000008', branchCode: 'JKT', productCategoryCode: 'CATJKT00000005', name: 'Tas Ransel Laptop' },
    { code: 'PRDJKT00000009', branchCode: 'JKT', productCategoryCode: 'CATJKT00000006', name: 'Tas Selempang Wanita' },
    { code: 'PRDBDG00000001', branchCode: 'BDG', productCategoryCode: 'CATBDG00000001', name: 'Sepatu Boot Pria' },
    { code: 'PRDBDG00000002', branchCode: 'BDG', productCategoryCode: 'CATBDG00000002', name: 'Sepatu Wedges Wanita' },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { code: product.code },
      update: {},
      create: product,
    });
  }
}

async function seedProductDetails() {
  console.log('Seeding product details...');
  const details = [
    {
      status: StatusEnum.GENERAL_ACTIVE,
      code: 'PDTJKT00000001',
      productCode: 'PRDJKT00000001',
      colorCode: 'BLK',
      supplierCode: 'SUPJKT00000001',
      article: 'SKF-001',
      size: '40',
      purchasePrice: 250000,
      salesPrice: 450000,
      wholesalePrice: 400000,
      stock: 50,
      purchaseDate: new Date('2024-01-15'),
    },
    {
      status: StatusEnum.GENERAL_ACTIVE,
      code: 'PDTJKT00000002',
      productCode: 'PRDJKT00000001',
      colorCode: 'BRN',
      supplierCode: 'SUPJKT00000001',
      article: 'SKF-001',
      size: '41',
      purchasePrice: 250000,
      salesPrice: 450000,
      wholesalePrice: 400000,
      stock: 45,
      purchaseDate: new Date('2024-01-15'),
    },
    {
      status: StatusEnum.GENERAL_ACTIVE,
      code: 'PDTJKT00000003',
      productCode: 'PRDJKT00000001',
      colorCode: 'BLK',
      supplierCode: 'SUPJKT00000001',
      article: 'SKF-001',
      size: '42',
      purchasePrice: 250000,
      salesPrice: 450000,
      wholesalePrice: 400000,
      stock: 60,
      purchaseDate: new Date('2024-01-15'),
    },
    {
      status: StatusEnum.GENERAL_ACTIVE,
      code: 'PDTJKT00000004',
      productCode: 'PRDJKT00000002',
      colorCode: 'WHT',
      supplierCode: 'SUPJKT00000001',
      article: 'SSC-002',
      size: '40',
      purchasePrice: 180000,
      salesPrice: 320000,
      wholesalePrice: 280000,
      stock: 100,
      purchaseDate: new Date('2024-02-01'),
    },
    {
      status: StatusEnum.GENERAL_ACTIVE,
      code: 'PDTJKT00000005',
      productCode: 'PRDJKT00000002',
      colorCode: 'BLK',
      supplierCode: 'SUPJKT00000001',
      article: 'SSC-002',
      size: '41',
      purchasePrice: 180000,
      salesPrice: 320000,
      wholesalePrice: 280000,
      stock: 80,
      purchaseDate: new Date('2024-02-01'),
    },
    {
      status: StatusEnum.GENERAL_ACTIVE,
      code: 'PDTJKT00000006',
      productCode: 'PRDJKT00000004',
      colorCode: 'RED',
      supplierCode: 'SUPJKT00000001',
      article: 'HHP-001',
      size: '36',
      purchasePrice: 200000,
      salesPrice: 380000,
      wholesalePrice: 340000,
      stock: 30,
      purchaseDate: new Date('2024-01-20'),
    },
    {
      status: StatusEnum.GENERAL_ACTIVE,
      code: 'PDTJKT00000007',
      productCode: 'PRDJKT00000006',
      colorCode: 'BLK',
      supplierCode: 'SUPJKT00000002',
      article: 'SG-001',
      size: '42',
      purchasePrice: 120000,
      salesPrice: 220000,
      wholesalePrice: 190000,
      stock: 75,
      purchaseDate: new Date('2024-02-10'),
    },
    {
      status: StatusEnum.GENERAL_ACTIVE,
      code: 'PDTJKT00000008',
      productCode: 'PRDJKT00000008',
      colorCode: 'NVY',
      supplierCode: 'SUPJKT00000003',
      article: 'TRL-001',
      size: 'L',
      purchasePrice: 300000,
      salesPrice: 550000,
      wholesalePrice: 480000,
      stock: 40,
      purchaseDate: new Date('2024-02-15'),
    },
    {
      status: StatusEnum.GENERAL_INACTIVE,
      code: 'PDTJKT00000009',
      productCode: 'PRDJKT00000003',
      colorCode: 'GRY',
      supplierCode: 'SUPJKT00000001',
      article: 'SOR-001',
      size: '43',
      purchasePrice: 220000,
      salesPrice: 400000,
      wholesalePrice: 350000,
      stock: 0,
      purchaseDate: new Date('2023-12-01'),
    },
    {
      status: StatusEnum.GENERAL_ACTIVE,
      code: 'PDTBDG00000001',
      productCode: 'PRDBDG00000001',
      colorCode: 'BLK',
      supplierCode: 'SUPBDG00000001',
      article: 'SBP-001',
      size: '42',
      purchasePrice: 280000,
      salesPrice: 500000,
      wholesalePrice: 450000,
      stock: 35,
      purchaseDate: new Date('2024-01-25'),
    },
  ];

  for (const detail of details) {
    await prisma.productDetail.upsert({
      where: { code: detail.code },
      update: {},
      create: detail,
    });
  }
}

async function seedPromos() {
  console.log('Seeding promos...');
  const promos = [
    {
      status: StatusEnum.GENERAL_ACTIVE,
      code: 'PRMJKT00000001',
      branchCode: 'JKT',
      name: 'Promo Tahun Baru',
      termsAndCondition: 'Minimum pembelian Rp 500.000',
      percentage: 10,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-01-31'),
    },
    {
      status: StatusEnum.GENERAL_ACTIVE,
      code: 'PRMJKT00000002',
      branchCode: 'JKT',
      name: 'Promo Member',
      termsAndCondition: 'Khusus member terdaftar',
      amount: 50000,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
    },
    {
      status: StatusEnum.GENERAL_ACTIVE,
      code: 'PRMJKT00000003',
      branchCode: 'JKT',
      name: 'Promo Weekend',
      termsAndCondition: 'Berlaku setiap Sabtu dan Minggu',
      percentage: 5,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-06-30'),
    },
    {
      status: StatusEnum.GENERAL_INACTIVE,
      code: 'PRMJKT00000004',
      branchCode: 'JKT',
      name: 'Promo Akhir Tahun 2024',
      termsAndCondition: 'Promo sudah berakhir',
      percentage: 15,
      startDate: new Date('2024-12-01'),
      endDate: new Date('2024-12-31'),
    },
    {
      status: StatusEnum.GENERAL_ACTIVE,
      code: 'PRMBDG00000001',
      branchCode: 'BDG',
      name: 'Promo Bandung Sale',
      termsAndCondition: 'Berlaku di cabang Bandung',
      percentage: 8,
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-02-28'),
    },
  ];

  for (const promo of promos) {
    await prisma.promo.upsert({
      where: { code: promo.code },
      update: {},
      create: promo,
    });
  }
}

async function seedCekGiro() {
  console.log('Seeding cek giro...');
  const cekGiros = [
    {
      type: 'CEK',
      code: 'CG-JKT-2025-0001',
      accountNumber: '1234567890',
      date: new Date('2025-01-15'),
    },
    {
      type: 'GIRO',
      code: 'CG-JKT-2025-0002',
      accountNumber: '0987654321',
      date: new Date('2025-01-20'),
    },
    {
      type: 'CEK',
      code: 'CG-BDG-2025-0001',
      accountNumber: '5678901234',
      date: new Date('2025-02-01'),
    },
  ];

  for (const cg of cekGiros) {
    await prisma.cekGiro.upsert({
      where: { code: cg.code },
      update: {},
      create: cg,
    });
  }
}

async function seedCekGiroDetails() {
  console.log('Seeding cek giro details...');
  const details = [
    {
      code: 'CGD-JKT-2025-0001',
      cekGiroCode: 'CG-JKT-2025-0001',
      accountNumber: '1234567890',
      accountName: 'PT Sepatu Indonesia',
      amount: 15000000,
      receiverName: 'Budi Santoso',
      receiverPhone: '081234567890',
      disbursementDate: new Date('2025-02-15'),
      handoverDate: new Date('2025-01-15'),
      note: 'Pembayaran invoice #INV-001',
    },
    {
      code: 'CGD-JKT-2025-0002',
      cekGiroCode: 'CG-JKT-2025-0001',
      accountNumber: '1234567890',
      accountName: 'PT Sepatu Indonesia',
      amount: 10000000,
      receiverName: 'Andi Wijaya',
      receiverPhone: '081234567891',
      disbursementDate: new Date('2025-03-01'),
      handoverDate: new Date('2025-01-20'),
      note: 'Pembayaran invoice #INV-002',
    },
    {
      code: 'CGD-JKT-2025-0003',
      cekGiroCode: 'CG-JKT-2025-0002',
      accountNumber: '0987654321',
      accountName: 'CV Sandal Makmur',
      amount: 8000000,
      receiverName: 'Siti Rahayu',
      receiverPhone: '081234567892',
      disbursementDate: new Date('2025-02-20'),
      handoverDate: new Date('2025-01-25'),
      note: 'Pembayaran invoice #INV-003',
    },
  ];

  for (const detail of details) {
    await prisma.cekGiroDetail.upsert({
      where: { code: detail.code },
      update: {},
      create: detail,
    });
  }
}

async function seedCekGiroOwners() {
  console.log('Seeding cek giro owners...');
  const owners = [
    { cekGiroCode: 'CG-JKT-2025-0001', userCode: 'USRJKT0002' },
    { cekGiroCode: 'CG-JKT-2025-0002', userCode: 'USRJKT0002' },
    { cekGiroCode: 'CG-BDG-2025-0001', userCode: 'USRJKT0003' },
  ];

  for (const owner of owners) {
    const existing = await prisma.cekGiroOwner.findFirst({
      where: { cekGiroCode: owner.cekGiroCode, userCode: owner.userCode },
    });
    if (!existing) {
      await prisma.cekGiroOwner.create({ data: owner });
    }
  }
}

async function seedAccountNumbers() {
  console.log('Seeding account numbers...');
  const accounts = [
    {
      module: ModuleEnum.GENERAL,
      bankCode: '014',
      ownerCode: 'USRJKT0002',
      accountName: 'Owner Utama',
      accountNumber: '1234567890123',
    },
    {
      module: ModuleEnum.GENERAL,
      bankCode: '008',
      ownerCode: 'USRJKT0002',
      accountName: 'Owner Utama Mandiri',
      accountNumber: '0987654321098',
    },
    {
      module: ModuleEnum.DEPOSIT,
      bankCode: '009',
      ownerCode: 'USRJKT0003',
      accountName: 'Pimpinan Cabang',
      accountNumber: '1122334455667',
    },
    {
      module: ModuleEnum.SUPPLIER,
      bankCode: '014',
      ownerCode: 'USRJKT0001',
      accountName: 'Super Admin BCA',
      accountNumber: '9988776655443',
    },
  ];

  for (const account of accounts) {
    const existing = await prisma.accountNumber.findUnique({
      where: { accountNumber: account.accountNumber },
    });
    if (!existing) {
      await prisma.accountNumber.create({ data: account });
    }
  }
}

async function seedStockOpnames() {
  console.log('Seeding stock opnames...');
  const stockOpnames = [
    {
      code: 'SOJKT00001',
      status: StatusEnum.GENERAL_ACTIVE,
      branchCode: 'JKT',
      year: 2025,
      month: 1,
      createdBy: 'USRJKT0006',
      updatedBy: 'USRJKT0006',
    },
    {
      code: 'SOBDG00001',
      status: StatusEnum.GENERAL_ACTIVE,
      branchCode: 'BDG',
      year: 2025,
      month: 1,
      createdBy: 'USRJKT0007',
      updatedBy: 'USRJKT0007',
    },
  ];

  for (const so of stockOpnames) {
    await prisma.stockOpname.upsert({
      where: { code: so.code },
      update: {},
      create: so,
    });
  }
}

async function seedStockOpnameDetails() {
  console.log('Seeding stock opname details...');
  const details = [
    { stockOpnameCode: 'SOJKT00001', productDetailCode: 'PDTJKT00000001', stockSystem: 50, stockActual: 48 },
    { stockOpnameCode: 'SOJKT00001', productDetailCode: 'PDTJKT00000002', stockSystem: 45, stockActual: 45 },
    { stockOpnameCode: 'SOJKT00001', productDetailCode: 'PDTJKT00000003', stockSystem: 60, stockActual: 59 },
    { stockOpnameCode: 'SOJKT00001', productDetailCode: 'PDTJKT00000004', stockSystem: 100, stockActual: 100 },
    { stockOpnameCode: 'SOBDG00001', productDetailCode: 'PDTBDG00000001', stockSystem: 35, stockActual: 35 },
  ];

  for (const detail of details) {
    const existing = await prisma.stockOpnameDetail.findFirst({
      where: { stockOpnameCode: detail.stockOpnameCode, productDetailCode: detail.productDetailCode },
    });
    if (!existing) {
      await prisma.stockOpnameDetail.create({ data: detail });
    }
  }
}

async function seedCashRegisters() {
  console.log('Seeding cash registers...');
  const registers = [
    {
      code: 'CR-JKT-20250101',
      branchCode: 'JKT',
      userCode: 'USRJKT0004',
      date: new Date('2025-01-01'),
      amount: 5000000,
      p100000: 30,
      p50000: 20,
      p20000: 25,
      p10000: 20,
      p5000: 10,
      p2000: 5,
      p1000: 10,
    },
    {
      code: 'CR-JKT-20250102',
      branchCode: 'JKT',
      userCode: 'USRJKT0004',
      date: new Date('2025-01-02'),
      amount: 4500000,
      p100000: 25,
      p50000: 25,
      p20000: 30,
      p10000: 15,
      p5000: 15,
    },
    {
      code: 'CR-BDG-20250101',
      branchCode: 'BDG',
      userCode: 'USRJKT0008',
      date: new Date('2025-01-01'),
      amount: 3000000,
      p100000: 20,
      p50000: 10,
      p20000: 20,
      p10000: 10,
    },
  ];

  for (const register of registers) {
    await prisma.cashRegister.upsert({
      where: { code: register.code },
      update: {},
      create: register,
    });
  }
}

async function seedClosings() {
  console.log('Seeding closings...');
  const closings = [
    {
      code: 'CL-JKT-20250101',
      branchCode: 'JKT',
      userCode: 'USRJKT0004',
      date: new Date('2025-01-01'),
      amount: 8500000,
      debit: 500000,
      p100000: 50,
      p50000: 40,
      p20000: 30,
      p10000: 20,
      p5000: 10,
    },
    {
      code: 'CL-JKT-20250102',
      branchCode: 'JKT',
      userCode: 'USRJKT0004',
      date: new Date('2025-01-02'),
      amount: 7200000,
      debit: 300000,
      p100000: 45,
      p50000: 35,
      p20000: 25,
      p10000: 15,
    },
    {
      code: 'CL-BDG-20250101',
      branchCode: 'BDG',
      userCode: 'USRJKT0008',
      date: new Date('2025-01-01'),
      amount: 5500000,
      debit: 200000,
      p100000: 35,
      p50000: 25,
      p20000: 20,
    },
  ];

  for (const closing of closings) {
    await prisma.closing.upsert({
      where: { code: closing.code },
      update: {},
      create: closing,
    });
  }
}

async function seedDeposits() {
  console.log('Seeding deposits...');
  const deposits = [
    {
      code: 'DP-JKT-20250101',
      status: StatusEnum.DEPOSIT_RECEIVED,
      branchCode: 'JKT',
      userCode: 'USRJKT0003',
      date: new Date('2025-01-01'),
      amount: 10000000,
      note: 'Setoran rutin harian',
    },
    {
      code: 'DP-JKT-20250102',
      status: StatusEnum.DEPOSIT_SENT,
      branchCode: 'JKT',
      userCode: 'USRJKT0003',
      date: new Date('2025-01-02'),
      amount: 8000000,
      note: 'Setoran penjualan kemarin',
    },
    {
      code: 'DP-BDG-20250101',
      status: StatusEnum.DEPOSIT_RECEIVED,
      branchCode: 'BDG',
      userCode: 'USRJKT0009',
      date: new Date('2025-01-01'),
      amount: 5000000,
      note: 'Setoran mingguan',
    },
  ];

  for (const deposit of deposits) {
    await prisma.deposit.upsert({
      where: { code: deposit.code },
      update: {},
      create: deposit,
    });
  }
}

async function seedExpenses() {
  console.log('Seeding expenses...');
  const expenses = [
    {
      code: 'EXP-JKT-20250101',
      branchCode: 'JKT',
      expenseCategoryCode: 'EXPJKT0001',
      userCode: 'USRJKT0003',
      date: new Date('2025-01-01'),
      amount: 1500000,
      description: 'Pembayaran listrik bulan Januari',
    },
    {
      code: 'EXP-JKT-20250102',
      branchCode: 'JKT',
      expenseCategoryCode: 'EXPJKT0002',
      userCode: 'USRJKT0003',
      date: new Date('2025-01-02'),
      amount: 500000,
      description: 'Pembayaran air bulan Januari',
    },
    {
      code: 'EXP-JKT-20250103',
      branchCode: 'JKT',
      expenseCategoryCode: 'EXPJKT0006',
      userCode: 'USRJKT0005',
      date: new Date('2025-01-03'),
      amount: 250000,
      description: 'Biaya transportasi kunjungan member',
    },
    {
      code: 'EXP-BDG-20250101',
      branchCode: 'BDG',
      expenseCategoryCode: 'EXPBDG0001',
      userCode: 'USRJKT0009',
      date: new Date('2025-01-01'),
      amount: 1200000,
      description: 'Pembayaran listrik bulan Januari',
    },
  ];

  for (const expense of expenses) {
    await prisma.expense.upsert({
      where: { code: expense.code },
      update: {},
      create: expense,
    });
  }
}

async function seedOrders() {
  console.log('Seeding orders...');
  const orders = [
    {
      code: 'ORD-JKT-20250101001',
      branchCode: 'JKT',
      memberCode: 'MBRJKT000000001',
      userCode: 'USRJKT0004',
      promoCode: 'PRMJKT00000002',
      totalPrice: 1250000,
      paymentType: PaymentTypeEnum.LUNAS,
    },
    {
      code: 'ORD-JKT-20250101002',
      branchCode: 'JKT',
      userCode: 'USRJKT0004',
      totalPrice: 640000,
      paymentType: PaymentTypeEnum.LUNAS,
    },
    {
      code: 'ORD-JKT-20250102001',
      branchCode: 'JKT',
      memberCode: 'MBRJKT000000002',
      userCode: 'USRJKT0004',
      totalPrice: 800000,
      paymentType: PaymentTypeEnum.TEMPO,
    },
    {
      code: 'ORD-BDG-20250101001',
      branchCode: 'BDG',
      memberCode: 'MBRBDG000000001',
      userCode: 'USRJKT0008',
      totalPrice: 950000,
      paymentType: PaymentTypeEnum.LUNAS,
    },
  ];

  for (const order of orders) {
    await prisma.order.upsert({
      where: { code: order.code },
      update: {},
      create: order,
    });
  }
}

async function seedOrderDetails() {
  console.log('Seeding order details...');
  const details = [
    {
      code: 'ORDD-JKT-20250101001-01',
      orderCode: 'ORD-JKT-20250101001',
      userCode: 'USRJKT0004',
      productDetailCode: 'PDTJKT00000001',
      priceType: PriceTypeEnum.ECER,
      quantity: 2,
      discountAmount: 0,
      totalPrice: 900000,
    },
    {
      code: 'ORDD-JKT-20250101001-02',
      orderCode: 'ORD-JKT-20250101001',
      userCode: 'USRJKT0004',
      productDetailCode: 'PDTJKT00000004',
      priceType: PriceTypeEnum.ECER,
      quantity: 1,
      discountAmount: 0,
      totalPrice: 320000,
    },
    {
      code: 'ORDD-JKT-20250101002-01',
      orderCode: 'ORD-JKT-20250101002',
      productDetailCode: 'PDTJKT00000004',
      priceType: PriceTypeEnum.ECER,
      quantity: 2,
      discountAmount: 0,
      totalPrice: 640000,
    },
    {
      code: 'ORDD-JKT-20250102001-01',
      orderCode: 'ORD-JKT-20250102001',
      productDetailCode: 'PDTJKT00000006',
      priceType: PriceTypeEnum.ECER,
      quantity: 2,
      discountAmount: 0,
      totalPrice: 760000,
    },
    {
      code: 'ORDD-BDG-20250101001-01',
      orderCode: 'ORD-BDG-20250101001',
      productDetailCode: 'PDTBDG00000001',
      priceType: PriceTypeEnum.GROSIR,
      quantity: 2,
      discountAmount: 50000,
      totalPrice: 850000,
    },
  ];

  for (const detail of details) {
    await prisma.orderDetail.upsert({
      where: { code: detail.code },
      update: {},
      create: detail,
    });
  }
}

async function seedOrderDiscounts() {
  console.log('Seeding order discounts...');
  const discounts = [
    {
      code: 'ORDDISC-JKT-20250101001',
      orderCode: 'ORD-JKT-20250101001',
      userCode: 'USRJKT0004',
      invoiceDiscountAmount: 0,
      productDiscountAmount: 0,
      promoDiscountAmount: 50000,
    },
    {
      code: 'ORDDISC-BDG-20250101001',
      orderCode: 'ORD-BDG-20250101001',
      userCode: 'USRJKT0008',
      invoiceDiscountAmount: 0,
      productDiscountAmount: 50000,
      promoDiscountAmount: 0,
    },
  ];

  for (const discount of discounts) {
    await prisma.orderDiscount.upsert({
      where: { code: discount.code },
      update: {},
      create: discount,
    });
  }
}

async function seedPayments() {
  console.log('Seeding payments...');
  const payments = [
    {
      code: 'PAY-JKT-20250101001-01',
      orderCode: 'ORD-JKT-20250101001',
      paymentMethod: PaymentMethodEnum.TUNAI,
      customerAmount: 1300000,
      amount: 1250000,
    },
    {
      code: 'PAY-JKT-20250101002-01',
      orderCode: 'ORD-JKT-20250101002',
      paymentMethod: PaymentMethodEnum.DEBIT,
      customerAmount: 640000,
      amount: 640000,
    },
    {
      code: 'PAY-JKT-20250102001-01',
      orderCode: 'ORD-JKT-20250102001',
      paymentMethod: PaymentMethodEnum.TUNAI,
      customerAmount: 400000,
      amount: 400000,
    },
    {
      code: 'PAY-BDG-20250101001-01',
      orderCode: 'ORD-BDG-20250101001',
      paymentMethod: PaymentMethodEnum.TRANSFER,
      customerAmount: 950000,
      amount: 950000,
    },
  ];

  for (const payment of payments) {
    await prisma.payment.upsert({
      where: { code: payment.code },
      update: {},
      create: payment,
    });
  }
}

async function seedPaymentBillings() {
  console.log('Seeding payment billings...');
  const billings = [
    {
      code: 'PB-JKT-20250103001',
      memberCode: 'MBRJKT000000002',
      userCode: 'USRJKT0005',
      paymentMethod: PaymentMethodEnum.TUNAI,
      amount: 250000,
      discount: 0,
    },
    {
      code: 'PB-JKT-20250104001',
      memberCode: 'MBRJKT000000003',
      userCode: 'USRJKT0005',
      paymentMethod: PaymentMethodEnum.TRANSFER,
      amount: 500000,
      discount: 25000,
    },
  ];

  for (const billing of billings) {
    await prisma.paymentBilling.upsert({
      where: { code: billing.code },
      update: {},
      create: billing,
    });
  }
}

async function seedRefunds() {
  console.log('Seeding refunds...');
  const refunds = [
    {
      code: 'REF-JKT-20250105001',
      orderCode: 'ORD-JKT-20250101002',
      userCode: 'USRJKT0004',
    },
  ];

  for (const refund of refunds) {
    await prisma.refund.upsert({
      where: { code: refund.code },
      update: {},
      create: refund,
    });
  }
}

async function seedRefundDetails() {
  console.log('Seeding refund details...');
  const details = [
    {
      code: 'REFD-JKT-20250105001-01',
      refundCode: 'REF-JKT-20250105001',
      refundMethod: RefundMethodEnum.CASH_EXCHANGE,
      orderDetailCode: 'ORDD-JKT-20250101002-01',
      quantity: 1,
    },
  ];

  for (const detail of details) {
    await prisma.refundDetail.upsert({
      where: { code: detail.code },
      update: {},
      create: detail,
    });
  }
}

async function seedRestocks() {
  console.log('Seeding restocks...');
  const restocks = [
    {
      code: 'RST-JKT-20250110001',
      status: StatusEnum.RESTOCK_RECEIVED,
      branchCode: 'JKT',
      userCode: 'USRJKT0006',
      supplierCode: 'SUPJKT00000001',
      supplierDiscountCode: 'SDJKT000000001',
      purchaseDate: new Date('2025-01-10'),
      receivedDate: new Date('2025-01-12'),
      note: 'Restock rutin bulanan',
      paymentStatus: StatusEnum.RESTOCK_PAID_OFF,
    },
    {
      code: 'RST-JKT-20250115001',
      status: StatusEnum.RESTOCK_DELIVERED,
      branchCode: 'JKT',
      userCode: 'USRJKT0006',
      supplierCode: 'SUPJKT00000002',
      purchaseDate: new Date('2025-01-15'),
      note: 'Restock sandal',
      paymentStatus: StatusEnum.RESTOCK_DEBT,
    },
    {
      code: 'RST-BDG-20250112001',
      status: StatusEnum.RESTOCK_WAITING_FOR_REVIEW,
      branchCode: 'BDG',
      userCode: 'USRJKT0007',
      supplierCode: 'SUPBDG00000001',
      purchaseDate: new Date('2025-01-12'),
      note: 'Restock sepatu boot',
      paymentStatus: StatusEnum.RESTOCK_DEBT,
    },
  ];

  for (const restock of restocks) {
    await prisma.restock.upsert({
      where: { code: restock.code },
      update: {},
      create: restock,
    });
  }
}

async function seedRestockDetails() {
  console.log('Seeding restock details...');
  const details = [
    {
      code: 'RSTD-JKT-20250110001-01',
      restockCode: 'RST-JKT-20250110001',
      productDetailCode: 'PDTJKT00000001',
      quantity: 20,
    },
    {
      code: 'RSTD-JKT-20250110001-02',
      restockCode: 'RST-JKT-20250110001',
      productDetailCode: 'PDTJKT00000002',
      quantity: 15,
    },
    {
      code: 'RSTD-JKT-20250115001-01',
      restockCode: 'RST-JKT-20250115001',
      productDetailCode: 'PDTJKT00000007',
      quantity: 30,
    },
    {
      code: 'RSTD-BDG-20250112001-01',
      restockCode: 'RST-BDG-20250112001',
      productDetailCode: 'PDTBDG00000001',
      quantity: 25,
    },
  ];

  for (const detail of details) {
    await prisma.restockDetail.upsert({
      where: { code: detail.code },
      update: {},
      create: detail,
    });
  }
}

async function seedRestockPayments() {
  console.log('Seeding restock payments...');
  const payments = [
    {
      code: 'RSTP-JKT-20250110001-01',
      restockCode: 'RST-JKT-20250110001',
      paymentMethod: PaymentMethodEnum.TRANSFER,
      amount: 8000000,
      discount: 400000,
    },
    {
      code: 'RSTP-JKT-20250115001-01',
      restockCode: 'RST-JKT-20250115001',
      paymentMethod: PaymentMethodEnum.GIRO,
      amount: 2000000,
      cekGiroDetailCode: 'CGD-JKT-2025-0001',
    },
  ];

  for (const payment of payments) {
    await prisma.restockPayment.upsert({
      where: { code: payment.code },
      update: {},
      create: payment,
    });
  }
}

async function seedUserPermissions() {
  console.log('Seeding user permissions...');
  const roles = [
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.KASIR,
    RoleEnum.SALES,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.STAFF_INVENTORY,
    RoleEnum.STAFF_WAREHOUSE,
    RoleEnum.ANGGOTA,
  ];

  const menus = [MenuEnum.Report, MenuEnum.Transaction, MenuEnum.Outlet, MenuEnum.Management];

  const subMenus = Object.values(SubMenuEnum);

  const permissions: Array<{
    role: RoleEnum;
    menu: MenuEnum;
    subMenu: SubMenuEnum;
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  }> = [];

  for (const role of roles) {
    for (const menu of menus) {
      const relevantSubMenus = subMenus.filter((sm) => {
        if (menu === MenuEnum.Report) return sm.startsWith('Report');
        if (menu === MenuEnum.Transaction) return sm.startsWith('Transaction');
        if (menu === MenuEnum.Outlet) return sm.startsWith('Outlet');
        if (menu === MenuEnum.Management) return sm.startsWith('Management');
        return false;
      });

      for (const subMenu of relevantSubMenus) {
        let view = false,
          create = false,
          update = false,
          del = false;

        if (role === RoleEnum.SUPER_ADMIN) {
          view = true;
          create = subMenu === SubMenuEnum.ManagementStaff;
          update = subMenu === SubMenuEnum.ManagementStaff;
          del = subMenu === SubMenuEnum.ManagementStaff;
        } else if (role === RoleEnum.OWNER) {
          view = true;
          if (menu === MenuEnum.Management) {
            create = true;
            update = true;
            del = true;
          }
        } else if (role === RoleEnum.PIMPINAN) {
          view = true;
          if (menu === MenuEnum.Transaction || menu === MenuEnum.Outlet || menu === MenuEnum.Management) {
            create = true;
            update = true;
            del = subMenu !== SubMenuEnum.OutletRestock;
          }
        } else if (role === RoleEnum.KASIR) {
          if (menu === MenuEnum.Transaction) {
            view = true;
            create = true;
          }
          if (subMenu === SubMenuEnum.OutletCashRegister || subMenu === SubMenuEnum.OutletClosing) {
            view = true;
            create = true;
          }
        } else if (role === RoleEnum.SALES) {
          if (subMenu === SubMenuEnum.TransactionSales || subMenu === SubMenuEnum.TransactionBilling) {
            view = true;
            create = true;
          }
          if (subMenu === SubMenuEnum.ManagementMember) {
            view = true;
          }
        } else if (role === RoleEnum.STAFF_INVENTORY) {
          if (subMenu === SubMenuEnum.OutletInventory || subMenu === SubMenuEnum.OutletStockOpname) {
            view = true;
            create = true;
            update = true;
          }
        } else if (role === RoleEnum.STAFF_WAREHOUSE) {
          if (subMenu === SubMenuEnum.OutletRestock) {
            view = true;
            create = true;
            update = true;
          }
        }

        permissions.push({
          role,
          menu,
          subMenu,
          view,
          create,
          update,
          delete: del,
        });
      }
    }
  }

  for (const perm of permissions) {
    const existing = await prisma.userPermission.findFirst({
      where: { role: perm.role, menu: perm.menu, subMenu: perm.subMenu },
    });
    if (!existing) {
      await prisma.userPermission.create({ data: perm });
    }
  }
}

async function main() {
  try {
    console.log('Starting database seed...\n');

    // Level 1: Independent tables (no foreign keys)
    await seedBanks();
    await seedColors();
    await seedReimbursementTypes();
    await seedCekGiroFailStatuses();

    // Level 2: Tables with simple dependencies
    await seedUsers();
    await seedBranches();

    // Level 3: Tables depending on Users and Branches
    await seedUserBranchDetails();
    await seedExpenseCategories();
    await seedSuppliers();
    await seedMembers();
    await seedProductCategories();
    await seedCekGiro();
    await seedAccountNumbers();
    await seedPromos();

    // Level 4: Tables depending on Level 3
    await seedSupplierDiscounts();
    await seedProducts();
    await seedCekGiroDetails();
    await seedCekGiroOwners();
    await seedPhones();

    // Level 5: Tables depending on Level 4
    await seedProductDetails();

    // Level 6: Operations depending on Products
    await seedStockOpnames();
    await seedStockOpnameDetails();
    await seedCashRegisters();
    await seedClosings();
    await seedDeposits();
    await seedExpenses();

    // Level 7: Orders and transactions
    await seedOrders();
    await seedOrderDetails();
    await seedOrderDiscounts();
    await seedPayments();
    await seedPaymentBillings();
    await seedRefunds();
    await seedRefundDetails();

    // Level 8: Restock operations
    await seedRestocks();
    await seedRestockDetails();
    await seedRestockPayments();

    // Level 9: User permissions
    await seedUserPermissions();

    console.log('\nDatabase seed completed successfully!');
  } catch (err) {
    console.error('Error during seeding:', err);
    throw err;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
