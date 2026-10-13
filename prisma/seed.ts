/* eslint-disable */
// Seed script — populates the Hostinger MySQL database with initial data
// from src/lib/content.ts (tours, accommodations, scheduled trips,
// destinations, testimonials, blog posts).
//
// Run after `npx prisma migrate deploy` to populate the database:
//   npx prisma db seed

import { PrismaClient } from "@prisma/client";
import {
  tourPackages,
  accommodations,
  scheduledTrips,
  testimonials,
  destinations,
  blogPosts,
} from "../src/lib/content";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Destinations + Game Parks
  for (const d of destinations) {
    await prisma.destination.upsert({
      where: { id: d.id },
      update: {},
      create: {
        id: d.id,
        name: d.name,
        country: d.country,
        tagline: d.tagline,
        description: d.description,
        image: d.image,
        imagePortrait: d.imagePortrait,
        days: d.days,
        price: d.price,
      },
    });
    if (d.gameParks) {
      for (const gp of d.gameParks) {
        await prisma.gamePark.upsert({
          where: { id: gp.id },
          update: {},
          create: {
            id: gp.id,
            name: gp.name,
            destinationId: d.id,
            description: gp.description,
            image: gp.image,
            wildlife: gp.wildlife,
          },
        });
      }
    }
  }
  console.log(`  ✓ ${destinations.length} destinations + game parks`);

  // Tours + Tour Days
  for (const t of tourPackages) {
    await prisma.tourPackage.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        name: t.name,
        subtitle: t.subtitle,
        duration: t.duration,
        durationDays: t.durationDays,
        durationNights: t.durationNights,
        price: t.price,
        priceFrom: t.priceFrom,
        priceOriginal: t.priceOriginal,
        highlights: t.highlights,
        image: t.image,
        galleryImages: t.galleryImages,
        destination: t.destination,
        activities: t.activities,
        tripType: t.tripType,
        accommodationLevel: t.accommodationLevel,
        nationalPark: t.nationalPark,
        featured: t.featured || false,
        minAge: t.minAge,
        accommodationIds: t.accommodationIds,
      },
    });
    if (t.days) {
      for (const day of t.days) {
        await prisma.tourDay.create({
          data: {
            day: day.day,
            title: day.title,
            description: day.description,
            image: day.image,
            tourId: t.id,
          },
        });
      }
    }
  }
  console.log(`  ✓ ${tourPackages.length} tours + itinerary days`);

  // Accommodations
  for (const a of accommodations) {
    await prisma.accommodation.upsert({
      where: { id: a.id },
      update: {},
      create: {
        id: a.id,
        name: a.name,
        location: a.location,
        type: a.type,
        description: a.description,
        image: a.image,
        galleryImages: a.galleryImages,
        features: a.features,
      },
    });
  }
  console.log(`  ✓ ${accommodations.length} accommodations`);

  // Scheduled Trips + Stops
  for (const t of scheduledTrips) {
    await prisma.scheduledTrip.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        name: t.name,
        destination: t.destination,
        startDate: new Date(t.startDate),
        endDate: new Date(t.endDate),
        durationDays: t.durationDays,
        priceFrom: t.priceFrom,
        priceOriginal: t.priceOriginal,
        image: t.image,
        galleryImages: t.galleryImages,
        description: t.description,
        highlights: t.highlights,
        inclusions: t.inclusions,
        exclusions: t.exclusions,
        groupSize: t.groupSize,
        spotsLeft: t.spotsLeft,
        accommodationLevel: t.accommodationLevel,
      },
    });
    if (t.stops) {
      for (const stop of t.stops) {
        await prisma.scheduledTripStop.create({
          data: {
            day: stop.day,
            title: stop.title,
            description: stop.description,
            image: stop.image,
            scheduledTripId: t.id,
          },
        });
      }
    }
  }
  console.log(`  ✓ ${scheduledTrips.length} scheduled trips + stops`);

  // Testimonials
  for (const t of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        name: t.name,
        role: t.role,
        avatar: t.avatar,
        content: t.content,
        published: t.published,
        date: new Date(t.date),
      },
    });
  }
  console.log(`  ✓ ${testimonials.length} testimonials`);

  // Blog Posts
  for (const p of blogPosts) {
    await prisma.blogPost.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        title: p.title,
        excerpt: p.excerpt,
        body: p.body,
        coverImage: p.coverImage,
        author: p.author,
        authorRole: p.authorRole,
        authorAvatar: p.authorAvatar,
        publishedDate: new Date(p.publishedDate),
        tags: p.tags,
        category: p.category,
        readTimeMins: p.readTimeMins,
        published: p.published,
        featured: p.featured || false,
      },
    });
  }
  console.log(`  ✓ ${blogPosts.length} blog posts`);

  // Settings (singleton row)
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      companyName: "Unzip Africa Safaris",
      tagline: "Curated African journeys",
      email: "hello@unzipafrica.com",
      copyright: "© Unzip Africa Safaris. All rights reserved.",
      developedBy: "Agaba Exeviar",
    },
  });
  console.log("  ✓ Settings (singleton)");

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
