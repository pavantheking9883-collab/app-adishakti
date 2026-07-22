import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding extensive production-ready data for ADISHAKTI...');

  // Clean existing
  await prisma.iVRCallLog.deleteMany();
  await prisma.safetyEvent.deleteMany();
  await prisma.guardian.deleteMany();
  await prisma.user.deleteMany();
  await prisma.scheme.deleteMany();
  await prisma.legalVideo.deleteMany();
  await prisma.protectionOfficer.deleteMany();
  await prisma.sHGProduct.deleteMany();
  await prisma.communityStory.deleteMany();
  await prisma.corporateTransportLog.deleteMany();
  await prisma.iCCComplaint.deleteMany();

  // Create Core Users
  const user1 = await prisma.user.create({
    data: {
      phone: '+919876543210',
      name: 'Sunitha Lakshmi',
      language: 'te',
      role: 'USER',
      consentAudioMonitoring: true,
      consentTimestamp: new Date(),
      guardians: {
        create: [
          { name: 'Ramakrishna (Husband)', phone: '+919876543211', priorityOrder: 1, verified: true },
          { name: 'Venkata Rao (Brother)', phone: '+919876543212', priorityOrder: 2, verified: true },
          { name: 'Saraswathi (Sister)', phone: '+919876543213', priorityOrder: 3, verified: false },
        ]
      }
    }
  });

  const user2 = await prisma.user.create({
    data: {
      phone: '+919123456789',
      name: 'Anusha Reddy',
      language: 'en',
      role: 'USER',
      consentAudioMonitoring: false,
      guardians: {
        create: [
          { name: 'Srinivas Reddy (Father)', phone: '+919123456780', priorityOrder: 1, verified: true }
        ]
      }
    }
  });

  // Control Room & HR Admins
  await prisma.user.create({
    data: {
      phone: '+918008001000',
      name: 'Andhra Pradesh Central Control Command Room',
      language: 'te',
      role: 'POLICE_ADMIN',
    }
  });

  await prisma.user.create({
    data: {
      phone: '+919988776655',
      name: 'Quantex Corp HR Officer',
      companyId: 'COMP-101',
      language: 'en',
      role: 'CORPORATE_ADMIN',
    }
  });

  // Seed Safety Events
  await prisma.safetyEvent.create({
    data: {
      userId: user1.id,
      type: 'RED',
      status: 'ACTIVE',
      startedAt: new Date(Date.now() - 5 * 60 * 1000),
      lastLat: 16.9891,
      lastLng: 81.7835,
      lastAddress: 'Godavari Station Road, Rajahmundry',
      lastBattery: 42,
      lastNetworkStatus: '4G Active (Jio)',
      audioFlag: true,
      audioUrl: 'https://cdn.adishakti.org/audio/sample_sos_event1.mp3',
      notes: 'SOS Panic alert triggered near Railway Station.',
      ivrCallLogs: {
        create: [
          { guardianId: (await prisma.guardian.findFirst({ where: { userId: user1.id, priorityOrder: 1 } }))!.id, outcome: 'UNREACHABLE' },
          { guardianId: (await prisma.guardian.findFirst({ where: { userId: user1.id, priorityOrder: 2 } }))!.id, outcome: 'ANSWERED' }
        ]
      }
    }
  });

  // Seed AP Government Schemes
  await prisma.scheme.createMany({
    data: [
      {
        title: 'DWCRA Collateral-Free MSME Loan',
        code: 'DWCRA-MSME-2026',
        description: 'Collateral-free credit up to ₹50,00,000 for SHG women micro-entrepreneurs with interest subvention.',
        eligibility: 'Active SHG member with minimum 2 years flawless repayment history.',
        benefit: '₹50,00,000 Loan at 4% Effective Interest Subvention',
        category: 'Loan',
        targetGroup: 'SHG / DWCRA Women',
        applicationUrl: 'https://serp.ap.gov.in/dwcra/msme',
        contactInfo: 'District SERP Office Rajahmundry: 0883-2476591'
      },
      {
        title: 'Stree Nidhi SHG Loan Scheme',
        code: 'STREE-NIDHI-01',
        description: 'Rapid approval credit for income-generating activities disbursed directly to SHG member bank accounts.',
        eligibility: 'Women aged 18 to 60 registered under SERP/MEPMA.',
        benefit: '₹50,000 - ₹2,00,000 within 48 Hours',
        category: 'Loan',
        targetGroup: 'SHG Women',
        applicationUrl: 'https://streenidhi.ap.gov.in',
        contactInfo: 'Stree Nidhi AP Hotline: 1800-425-9999'
      },
      {
        title: 'YSR Aasara Scheme',
        code: 'YSR-AASARA-04',
        description: 'Reimbursement of outstanding SHG bank loan debt directly to women self-help group accounts.',
        eligibility: 'All DWCRA women group members registered prior to April 2019.',
        benefit: 'Debt waiver relief paid in four installments',
        category: 'Grant',
        targetGroup: 'SHG Women',
        applicationUrl: 'https://navasakam.ap.gov.in',
        contactInfo: 'Grama Sachivalayam Women Protection Secretary'
      },
      {
        title: 'PM Surya Ghar Muft Bijli Yojana',
        code: 'PM-SURYA-2026',
        description: 'Roof-top solar installation subsidy providing up to 300 units of free electricity per month for rural households.',
        eligibility: 'Low & middle-income households with own roof space.',
        benefit: 'Subsidy up to ₹78,000 for 3kW solar systems',
        category: 'Subsidy',
        targetGroup: 'All Households / Families',
        applicationUrl: 'https://pmsuryaghar.gov.in',
        contactInfo: 'APEPDCL Toll-Free: 1912'
      }
    ]
  });

  // Seed Production-Ready Protection Officers & Sakhi One Stop Centres across AP Districts
  await prisma.protectionOfficer.createMany({
    data: [
      {
        district: 'East Godavari (Rajahmundry)',
        officeName: 'Sakhi One Stop Centre - District Hospital Compound',
        officerName: 'Mrs. Ch. Vijayalakshmi (District Protection Officer)',
        phone: '0883-2441091',
        address: 'Opposite GGH Gynaecology Wing, Danavaipeta, Rajahmundry',
        lat: 16.9920,
        lng: 81.7850
      },
      {
        district: 'Kakinada',
        officeName: 'Sakhi One Stop Centre Kakinada',
        officerName: 'Mrs. P. Lalitha Kumari',
        phone: '0884-2330044',
        address: 'Behind Collectorate Office, Kakinada',
        lat: 16.9800,
        lng: 82.2400
      },
      {
        district: 'Visakhapatnam',
        officeName: 'Sakhi One Stop Centre Visakhapatnam',
        officerName: 'Dr. G. Hemalatha (Nodal Officer)',
        phone: '0891-2563344',
        address: 'King George Hospital (KGH) Compound, Visakhapatnam',
        lat: 17.7120,
        lng: 83.2980
      },
      {
        district: 'Krishna (Vijayawada)',
        officeName: 'Sakhi One Stop Centre Krishna',
        officerName: 'Mrs. K. Saraswathi Devi',
        phone: '0866-2489955',
        address: 'Old Government Hospital Compound, Hanumanpet, Vijayawada',
        lat: 16.5160,
        lng: 80.6280
      },
      {
        district: 'Guntur',
        officeName: 'Sakhi One Stop Centre Guntur',
        officerName: 'Mrs. M. Sandhya Rani',
        phone: '0863-2234091',
        address: 'Near District Court Complex, Guntur',
        lat: 16.3000,
        lng: 80.4500
      },
      {
        district: 'Tirupati',
        officeName: 'Sakhi One Stop Centre Tirupati',
        officerName: 'Mrs. S. Radhamma',
        phone: '0877-2284591',
        address: 'Ruia Government Hospital Compound, Tirupati',
        lat: 13.6280,
        lng: 79.4190
      }
    ]
  });

  // Seed Vernacular Legal Videos (&le;90s)
  await prisma.legalVideo.createMany({
    data: [
      {
        title: 'Domestic Violence Act 2005: Women Right to Residence',
        topic: 'Domestic Violence',
        durationSec: 85,
        language: 'te',
        videoUrl: 'https://cdn.adishakti.org/videos/dv_act_rights_te.mp4',
        advocateName: 'Adv. S. Lakshmi Prasanna',
        advocateRole: 'High Court Senior Advocate & Legal Aid Trustee',
        verified: true
      },
      {
        title: 'Protection from Cyber Bullying, Stalking & Morphing: IT Act 66E',
        topic: 'Cybercrime',
        durationSec: 90,
        language: 'te',
        videoUrl: 'https://cdn.adishakti.org/videos/cybercrime_it66e_te.mp4',
        advocateName: 'K. V. Subba Rao',
        advocateRole: 'AP Police Cyber Advisor & Specialist',
        verified: true
      },
      {
        title: 'POSH Act 2013: Workplace Harassment Complaints Committee',
        topic: 'Workplace Safety',
        durationSec: 80,
        language: 'te',
        videoUrl: 'https://cdn.adishakti.org/videos/posh_act_workplace_te.mp4',
        advocateName: 'Adv. P. Sharada Devi',
        advocateRole: 'POSH Compliance Auditor & Corporate Advisor',
        verified: true
      },
      {
        title: 'Hindu Succession Amendment Act 2005: Equal Ancestral Property Rights',
        topic: 'Property Rights',
        durationSec: 75,
        language: 'te',
        videoUrl: 'https://cdn.adishakti.org/videos/property_succession_te.mp4',
        advocateName: 'Adv. M. Gouthami',
        advocateRole: 'AP State Legal Services Authority Member',
        verified: true
      }
    ]
  });

  // Seed SHG Products
  await prisma.sHGProduct.createMany({
    data: [
      {
        title: 'Handcrafted Uppada Pure Silk Saree',
        description: 'Authentic Jamdani weave silk saree handcrafted by Godavari Sri Mahila SHG weavers.',
        price: 4500,
        category: 'Handlooms',
        shgGroup: 'Godavari Sri Mahila DWCRA Sangham',
        district: 'East Godavari',
        contactPhone: '+919440188234',
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'
      },
      {
        title: 'Organic Turmeric & Chilly Powder (1kg Pack)',
        description: 'Pure, pesticide-free stone-ground spices cultivated by Kadiyam Organic Farmers SHG.',
        price: 280,
        category: 'Organic Food',
        shgGroup: 'Kadiyam Annapurna Mahila Group',
        district: 'East Godavari',
        contactPhone: '+919848123456',
        imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600'
      }
    ]
  });

  // Seed Stories
  await prisma.communityStory.createMany({
    data: [
      {
        title: 'From ₹500 Savings to a Micro-Jute Mill in Kadiyam',
        content: 'Our DWCRA group started with just 10 women saving ₹50 per month. With Stree Nidhi support, we now employ 18 local women and supply eco-bags to 4 super markets.',
        authorName: 'Subbalakshmi K.',
        district: 'East Godavari',
        likes: 142
      }
    ]
  });

  console.log('Production ready database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
