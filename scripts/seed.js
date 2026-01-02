const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Import models
const User = require('../models/User');
const Language = require('../models/Language');
const Hero = require('../models/Hero');
const About = require('../models/About');
const Service = require('../models/Service');
const Stat = require('../models/Stat');
const Workflow = require('../models/Workflow');
const ContactInfo = require('../models/ContactInfo');
const MapUrl = require('../models/MapUrl');

// Read locale files
const azLocale = JSON.parse(fs.readFileSync(path.join(__dirname, '../locales/az.json'), 'utf-8'));
const enLocale = JSON.parse(fs.readFileSync(path.join(__dirname, '../locales/en.json'), 'utf-8'));

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Language.deleteMany({}),
            Hero.deleteMany({}),
            About.deleteMany({}),
            Service.deleteMany({}),
            Stat.deleteMany({}),
            Workflow.deleteMany({}),
            ContactInfo.deleteMany({}),
            MapUrl.deleteMany({})
        ]);
        console.log('Existing data cleared');

        // Seed Languages
        await Language.create([
            { lang: 'az' },
            { lang: 'en' }
        ]);
        console.log('✓ Languages seeded');

        // Seed SuperAdmin User
        await User.create({
            full_name: 'Super Admin',
            email: 'admin@trconstruction.az',
            password: 'Admin@123',
            phone: '+994 XX XXX XX XX',
            role: 'superAdmin'
        });
        console.log('✓ SuperAdmin user created (email: admin@trconstruction.az, password: Admin@123)');

        // Seed Hero
        await Hero.create({
            title: new Map([
                ['az', azLocale.hero.title],
                ['en', enLocale.hero.title]
            ]),
            info: new Map([
                ['az', azLocale.hero.subtitle],
                ['en', enLocale.hero.subtitle]
            ]),
            images: []
        });
        console.log('✓ Hero section seeded');

        // Seed About
        await About.create({
            title: new Map([
                ['az', azLocale.about.title],
                ['en', enLocale.about.title]
            ]),
            info: new Map([
                ['az', azLocale.about.sectionSubtitle],
                ['en', enLocale.about.sectionSubtitle]
            ]),
            description: new Map([
                ['az', azLocale.about.description],
                ['en', enLocale.about.description]
            ]),
            image: '',
            our_mission: new Map([
                ['az', azLocale.about.mission.text],
                ['en', enLocale.about.mission.text]
            ]),
            our_vision: new Map([
                ['az', azLocale.about.vision.text],
                ['en', enLocale.about.vision.text]
            ])
        });
        console.log('✓ About section seeded');

        // Seed Services from locale items
        const serviceItems = Object.keys(azLocale.services.items);
        for (const key of serviceItems) {
            await Service.create({
                title: new Map([
                    ['az', azLocale.services.items[key].title],
                    ['en', enLocale.services.items[key].title]
                ]),
                info: new Map([
                    ['az', azLocale.services.items[key].description],
                    ['en', enLocale.services.items[key].description]
                ])
            });
        }
        console.log('✓ Services seeded');

        // Seed Stats
        const statsData = [
            { countAz: '150+', countEn: '150+', detailAz: azLocale.stats.projects, detailEn: enLocale.stats.projects },
            { countAz: '10+', countEn: '10+', detailAz: azLocale.stats.experience, detailEn: enLocale.stats.experience },
            { countAz: '200+', countEn: '200+', detailAz: azLocale.stats.clients, detailEn: enLocale.stats.clients },
            { countAz: '50+', countEn: '50+', detailAz: azLocale.stats.team, detailEn: enLocale.stats.team }
        ];
        for (const stat of statsData) {
            await Stat.create({
                count: new Map([
                    ['az', stat.countAz],
                    ['en', stat.countEn]
                ]),
                detail: new Map([
                    ['az', stat.detailAz],
                    ['en', stat.detailEn]
                ])
            });
        }
        console.log('✓ Stats seeded');

        // Seed Workflow steps
        const workflowSteps = Object.keys(azLocale.workflow.steps);
        for (const key of workflowSteps) {
            await Workflow.create({
                title: new Map([
                    ['az', azLocale.workflow.steps[key].title],
                    ['en', enLocale.workflow.steps[key].title]
                ]),
                details: new Map([
                    ['az', azLocale.workflow.steps[key].description],
                    ['en', enLocale.workflow.steps[key].description]
                ])
            });
        }
        console.log('✓ Workflow steps seeded');

        // Seed Contact Info
        const contactData = [
            {
                titleAz: azLocale.contact.info.address,
                titleEn: enLocale.contact.info.address,
                detailAz: azLocale.contact.info.addressValue,
                detailEn: enLocale.contact.info.addressValue,
                type: 'address'
            },
            {
                titleAz: azLocale.contact.info.phone,
                titleEn: enLocale.contact.info.phone,
                detailAz: azLocale.contact.info.phoneValue,
                detailEn: enLocale.contact.info.phoneValue,
                type: 'phone'
            },
            {
                titleAz: azLocale.contact.info.email,
                titleEn: enLocale.contact.info.email,
                detailAz: azLocale.contact.info.emailValue,
                detailEn: enLocale.contact.info.emailValue,
                type: 'email'
            },
            {
                titleAz: azLocale.contact.info.workingHours,
                titleEn: enLocale.contact.info.workingHours,
                detailAz: azLocale.contact.info.workingHoursValue,
                detailEn: enLocale.contact.info.workingHoursValue,
                type: 'working_hours'
            }
        ];
        for (const contact of contactData) {
            await ContactInfo.create({
                title: new Map([
                    ['az', contact.titleAz],
                    ['en', contact.titleEn]
                ]),
                detail: new Map([
                    ['az', contact.detailAz],
                    ['en', contact.detailEn]
                ]),
                url: '',
                contact_type: contact.type
            });
        }
        console.log('✓ Contact info seeded');

        // Seed Map coordinates (Baku, Azerbaijan)
        await MapUrl.create({
            long: '49.8671',
            lat: '40.4093'
        });
        console.log('✓ Map coordinates seeded');

        console.log('\n========================================');
        console.log('Database seeding completed successfully!');
        console.log('========================================');
        console.log('\nDefault SuperAdmin credentials:');
        console.log('Email: admin@trconstruction.az');
        console.log('Password: Admin@123');
        console.log('========================================\n');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
