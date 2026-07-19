import { departments, iconMap } from '../data/seed'

const iconOptions = Object.keys(iconMap).map((key) => ({ label: key, value: key }))

export const faqFields = [
  { name: 'q', label: 'Question', type: 'text', required: true },
  { name: 'a', label: 'Answer', type: 'textarea', required: true },
]

export const keyStatFields = [
  { name: 'label', label: 'Label', type: 'text', required: true },
  { name: 'value', label: 'Value', type: 'text', required: true },
]

export function heroSlideSchema() {
  return [
    {
      title: 'Slide Content',
      columns: 2,
      fields: [
        { name: 'badgeText', label: 'Badge', type: 'text', maxLength: 80 },
        { name: 'title', label: 'Heading', type: 'text', required: true, maxLength: 120 },
        { name: 'subtitle', label: 'Subtext', type: 'textarea', maxLength: 260 },
        { name: 'altText', label: 'Image alt text', type: 'text', maxLength: 140 },
      ],
    },
    {
      title: 'Hero Image',
      fields: [{ name: 'imageUrl', label: 'Hero Image', type: 'image', required: true }],
    },
    {
      title: 'Buttons & Display',
      columns: 3,
      fields: [
        { name: 'ctaText', label: 'Primary Button Label', type: 'text' },
        { name: 'ctaLink', label: 'Primary Button Link', type: 'text' },
        { name: 'secondaryCtaText', label: 'Secondary Button Label', type: 'text' },
        { name: 'secondaryCtaLink', label: 'Secondary Button Link', type: 'text' },
        { name: 'order', label: 'Display Order', type: 'number' },
        { name: 'active', label: 'Show Slide', type: 'boolean' },
      ],
    },
  ]
}

export function doctorSchema() {
  return [
    {
      title: 'Basic Info',
      columns: 2,
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true, maxLength: 100 },
        { name: 'qualifications', label: 'Qualifications', type: 'text', maxLength: 160 },
        { name: 'specialty', label: 'Specialty', type: 'text', maxLength: 160 },
        { name: 'practicingSinceYear', label: 'Practicing Since Year', type: 'number' },
        { name: 'proceduresCount', label: 'Procedures Count', type: 'text' },
        { name: 'consultationTiming', label: 'Consultation Timing', type: 'textarea' },
        { name: 'freeCampInfo', label: 'Free Camp Info', type: 'textarea' },
        { name: 'bio', label: 'Bio', type: 'textarea', maxLength: 900 },
      ],
    },
    {
      title: 'Photo',
      fields: [
        { name: 'photoUrl', label: 'Doctor Photo', type: 'image' },
        { name: 'altText', label: 'Photo alt text', type: 'text', maxLength: 140 },
      ],
    },
    {
      title: 'Awards',
      fields: [{ name: 'awards', label: 'Awards', type: 'richBulletList', addLabel: 'Add Award' }],
    },
    {
      title: 'Memberships',
      fields: [{ name: 'memberships', label: 'Memberships', type: 'richBulletList', addLabel: 'Add Membership' }],
    },
    {
      title: 'FAQs',
      fields: [{ name: 'faqs', label: 'FAQs', type: 'repeatableGroup', fields: faqFields, itemLabel: 'FAQ', addLabel: 'Add FAQ' }],
    },
    {
      title: 'Journey Timeline',
      fields: [
        {
          name: 'journeySteps',
          label: 'Journey Steps',
          type: 'repeatableGroup',
          itemLabel: 'Step',
          addLabel: 'Add Step',
          fields: [
            { name: 'title', label: 'Title', type: 'text' },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'imageUrl', label: 'Step Image', type: 'image' },
          ],
        },
      ],
    },
    {
      title: 'Publishing',
      columns: 2,
      fields: [
        { name: 'needsVerification', label: 'Needs Verification Badge', type: 'boolean' },
        { name: 'order', label: 'Display Order', type: 'number' },
      ],
    },
  ]
}

export function gallerySchema() {
  return [
    {
      title: 'Gallery Image',
      fields: [{ name: 'imageUrl', label: 'Image', type: 'image', required: true }],
    },
    {
      title: 'Details',
      columns: 2,
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true, maxLength: 120 },
        { name: 'shortDescription', label: 'Short Description', type: 'textarea', maxLength: 300 },
        { name: 'category', label: 'Category', type: 'select', options: [
          { value: 'hospital', label: 'Hospital' },
          { value: 'doctors', label: 'Doctors' },
          { value: 'lab', label: 'Lab' },
          { value: 'ivf', label: 'IVF' },
          { value: 'success-stories', label: 'Success Stories' },
          { value: 'events', label: 'Events' },
          { value: 'counselling', label: 'Counselling' },
          { value: 'awards', label: 'Awards' },
          { value: 'facilities', label: 'Facilities' },
          { value: 'medical-camp', label: 'Medical Camp' },
          { value: 'videos', label: 'Videos' }
        ], required: true },
        { name: 'album', label: 'Album', type: 'select', options: [
          { value: 'hospital', label: 'Hospital' },
          { value: 'doctors', label: 'Doctors' },
          { value: 'operation-theatre', label: 'Operation Theatre' },
          { value: 'lab', label: 'Lab' },
          { value: 'reception', label: 'Reception' },
          { value: 'rooms', label: 'Rooms' },
          { value: 'events', label: 'Events' },
          { value: 'medical-camp', label: 'Medical Camp' },
          { value: 'awards', label: 'Awards' },
          { value: 'patient-awareness', label: 'Patient Awareness' },
          { value: 'success-stories', label: 'Success Stories' },
          { value: 'infrastructure', label: 'Infrastructure' },
          { value: 'videos', label: 'Videos' }
        ] },
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'location', label: 'Location', type: 'text', maxLength: 120 },
        { name: 'photographer', label: 'Photographer (Optional)', type: 'text', maxLength: 120 },
        { name: 'tags', label: 'Tags (comma separated)', type: 'text', maxLength: 200 },
      ]
    },
    {
      title: 'Display & SEO',
      columns: 2,
      fields: [
        { name: 'altText', label: 'Alt Text', type: 'text', maxLength: 140 },
        { name: 'seoTitle', label: 'SEO Title', type: 'text', maxLength: 140 },
        { name: 'seoDescription', label: 'SEO Description', type: 'textarea', maxLength: 260 },
        { name: 'featured', label: 'Featured Image', type: 'boolean' },
        { name: 'homepage', label: 'Show on Homepage', type: 'boolean' },
        { name: 'status', label: 'Status', type: 'select', options: [
          { value: 'published', label: 'Published' },
          { value: 'draft', label: 'Draft' }
        ] },
        { name: 'order', label: 'Display Order', type: 'number' },
        { name: 'active', label: 'Active', type: 'boolean' }
      ]
    }
  ]
}

export function blogSchema() {
  return [
    {
      title: 'Article Basics',
      columns: 2,
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true, maxLength: 120 },
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'excerpt', label: 'Excerpt', type: 'textarea', maxLength: 180 },
        { name: 'category', label: 'Category', type: 'text' },
        { name: 'readTime', label: 'Read Time', type: 'text' },
        { name: 'date', label: 'Publish Date', type: 'date' },
        { name: 'author', label: 'Author', type: 'text' },
        { name: 'authorTitle', label: 'Author Title', type: 'text' },
        { name: 'published', label: 'Published', type: 'boolean' },
      ],
    },
    {
      title: 'Cover Image',
      fields: [{ name: 'coverImageUrl', label: 'Cover Image', type: 'image' }],
    },
    {
      title: 'Article Content',
      fields: [
        { name: 'content', label: 'Paragraphs', type: 'richBulletList', addLabel: 'Add Paragraph' },
        { name: 'tags', label: 'Tags', type: 'richBulletList', addLabel: 'Add Tag' },
      ],
    },
  ]
}

export function testimonialSchema() {
  return [
    {
      title: 'Story',
      columns: 2,
      fields: [
        { name: 'patientName', label: 'Patient Name', type: 'text', required: true },
        { name: 'rating', label: 'Rating', type: 'number' },
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'story', label: 'Written Story', type: 'textarea', maxLength: 900 },
        { name: 'youtubeUrl', label: 'YouTube Video URL', type: 'youtubeUrl' },
      ],
    },
    {
      title: 'Publishing',
      columns: 3,
      fields: [
        { name: 'consentConfirmed', label: 'Consent Confirmed', type: 'boolean' },
        { name: 'active', label: 'Show Testimonial', type: 'boolean' },
        { name: 'order', label: 'Display Order', type: 'number' },
      ],
    },
  ]
}

export function freeCampSchema() {
  return [
    {
      title: 'Camp Basics',
      columns: 2,
      fields: [
        {
          name: 'title',
          label: 'Service Name',
          type: 'readonly',
          hint: 'Locked catalog name shown in the public navbar and admin service list.',
        },
        { name: 'nextCampDate', label: 'Next Camp Date', type: 'date' },
        { name: 'registrationInstructions', label: 'Registration Instructions', type: 'textarea' },
        { name: 'needsVerification', label: 'Needs Verification Badge', type: 'boolean' },
      ],
    },
    {
      title: 'Home Banner',
      columns: 2,
      fields: [
        { name: 'bannerEyebrow', label: 'Banner Eyebrow', type: 'text' },
        { name: 'bannerButtonLabel', label: 'Button Label', type: 'text' },
      ],
    },
    {
      title: 'What To Bring',
      fields: [
        { name: 'whatToBringTitle', label: 'Section Title', type: 'text' },
        { name: 'whatToBring', label: 'Items', type: 'richBulletList', addLabel: 'Add Item' },
      ],
    },
    {
      title: 'Highlights',
      fields: [
        { name: 'highlightsTitle', label: 'Section Title', type: 'text' },
        { name: 'highlights', label: 'Items', type: 'richBulletList', addLabel: 'Add Highlight' },
      ],
    },
  ]
}

export function serviceCategorySchema() {
  return [
    {
      title: 'Category Basics',
      columns: 2,
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'shortTitle', label: 'Short Title', type: 'text' },
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'tagline', label: 'Tagline', type: 'textarea' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'order', label: 'Display Order', type: 'number' },
      ],
    },
    {
      title: 'Visuals',
      columns: 2,
      fields: [
        {
          name: 'mediaType',
          label: 'Spotlight Media Type',
          type: 'select',
          options: [
            { value: 'image', label: 'Static Image' },
            { value: 'video', label: 'Autoplay Video' },
          ],
        },
        { name: 'imageUrl', label: 'Category Image', type: 'image' },
        { name: 'iconUrl', label: 'Custom Icon', type: 'image' },
        { name: 'iconKey', label: 'Icon', type: 'select', options: iconOptions },
        { name: 'accentColor', label: 'Accent Color', type: 'colorToken' },
        { name: 'videoUrl', label: 'Spotlight Video URL', type: 'youtubeUrl' },
        { name: 'cardImages', label: 'Spotlight Triptych Images (List)', type: 'richBulletList', addLabel: 'Add Image URL' },
        { name: 'highlightBullets', label: 'Spotlight Emoji Bullets (List)', type: 'richBulletList', addLabel: 'Add Bullet' },
      ],
    },
    {
      title: 'Stats & Notes',
      fields: [
        { name: 'keyStats', label: 'Key Stats', type: 'repeatableGroup', fields: keyStatFields, itemLabel: 'Stat', addLabel: 'Add Stat' },
        { name: 'doctorNote', label: 'Doctor Note', type: 'textarea' },
      ],
    },
  ]
}

export function trustBlockSchema() {
  return [
    {
      title: 'Content',
      columns: 2,
      fields: [
        { name: 'heading', label: 'Heading', type: 'text', required: true },
        { name: 'body', label: 'Body', type: 'textarea', required: true },
        { name: 'iconKey', label: 'Icon', type: 'select', options: iconOptions },
        { name: 'iconUrl', label: 'Custom Icon', type: 'image' },
        { name: 'order', label: 'Display Order', type: 'number' },
        { name: 'active', label: 'Show Block', type: 'boolean' },
      ],
    },
  ]
}

export function departmentsSchema() {
  return [
    {
      title: 'Department Option',
      columns: 3,
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'order', label: 'Display Order', type: 'number' },
        { name: 'active', label: 'Show In Forms', type: 'boolean' },
      ],
    },
  ]
}

export function subServiceBaseSchema(categoryOptions = []) {
  return [
    {
      title: 'Page Basics',
      description: 'Title, category, featured quick-link toggle, and public page status.',
      columns: 2,
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'categoryId', label: 'Category', type: 'select', options: categoryOptions },
        { name: 'heroImage', label: 'Fallback Hero Image', type: 'image' },
        { name: 'heroHeading', label: 'Fallback Hero Heading', type: 'text' },
        { name: 'heroSubtitle', label: 'Fallback Hero Subtext', type: 'textarea' },
        { name: 'shortDescription', label: 'One-Line Card Description', type: 'text', maxLength: 160 },
        { name: 'order', label: 'Display Order', type: 'number' },
        { name: 'featured', label: 'Feature Below Hero', type: 'boolean' },
        { name: 'active', label: 'Show Page', type: 'boolean' },
      ],
    },
    {
      title: 'Hero Slider Images',
      description: 'Upload up to 10 images for the animated hero section slider on the right side of the page.',
      fields: [
        {
          name: 'heroImages',
          label: 'Hero Images',
          type: 'imageList',
          itemLabel: 'Slide Image',
          maxItems: 10,
        }
      ]
    },
    {
      title: 'At a Glance',
      fields: [
        {
          name: 'atAGlanceStats',
          label: 'Stat Chips',
          type: 'repeatableGroup',
          itemLabel: 'Chip',
          addLabel: 'Add Stat Chip',
          fields: [
            { name: 'label', label: 'Label', type: 'text' },
            { name: 'value', label: 'Value', type: 'text' },
            { name: 'icon', label: 'Icon', type: 'select', options: iconOptions },
          ],
        },
        { name: 'patientGuideUrl', label: 'Patient Guide PDF URL', type: 'text' },
      ],
    },
  ]
}

export function subServiceSectionSchemas() {
  return [
    {
      id: 'video',
      title: 'Section 1 - Specialist Video (Public: "Expert Insights / Watch Video")',
      sections: [
        {
          title: 'Video Header',
          description: 'Appears as Section 1 on the public sub-service page.',
          fields: [{ name: 'videoUrl', label: 'Specialist YouTube URL', type: 'youtubeUrl' }],
        },
      ],
    },
    {
      id: 'whatIsIt',
      title: 'Section 2 - Overview & Definition (Public: "What is [Title]?")',
      sections: [
        {
          title: 'Definition',
          fields: [
            { name: 'whatIsIt', label: 'Definition', type: 'textarea', maxLength: 900 },
            { name: 'whatIsItImage', label: 'Supporting Image', type: 'image' },
            { name: 'doctorNoteQuote', label: 'Doctor Note Quote', type: 'textarea', maxLength: 500 },
          ],
        },
      ],
    },
    {
      id: 'classification',
      title: 'Section 3 - Classifications & Types (Public: "Classifications & Types")',
      sections: [
        {
          title: 'Classification Cards',
          fields: [
            {
              name: 'classification',
              label: 'Classification',
              type: 'repeatableGroup',
              itemLabel: 'Classification',
              addLabel: 'Add Classification',
              fields: [
                { name: 'name', label: 'Name', type: 'text' },
                { name: 'description', label: 'Description', type: 'textarea' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'causes',
      title: 'Section 4 - Root Causes & Triggers (Public: "Understanding Root Causes")',
      sections: [
        {
          title: 'Causes',
          fields: [
            {
              name: 'causes',
              label: 'Causes',
              type: 'repeatableGroup',
              itemLabel: 'Cause',
              addLabel: 'Add Cause',
              fields: [
                { name: 'title', label: 'Title', type: 'text', required: true },
                { name: 'description', label: 'Description', type: 'textarea', required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'riskFactors',
      title: 'Section 5 - Risk Profiles & Tags (Public: "Risk Screening / Risk Profiles & Tags")',
      sections: [
        {
          title: 'Risk Factors',
          fields: [
            {
              name: 'riskFactors',
              label: 'Risk Factors',
              type: 'repeatableGroup',
              itemLabel: 'Risk Factor',
              addLabel: 'Add Risk Factor',
              fields: [
                { name: 'text', label: 'Text', type: 'text' },
                {
                  name: 'level',
                  label: 'Level',
                  type: 'select',
                  options: [
                    { label: 'Moderate', value: 'moderate' },
                    { label: 'High', value: 'high' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'symptoms',
      title: 'Section 6 - Symptoms & Indicators (Public: "Key Symptoms / Checklist")',
      sections: [
        {
          title: 'Symptoms',
          fields: [
            {
              name: 'symptoms',
              label: 'Symptoms / Checks',
              type: 'repeatableGroup',
              itemLabel: 'Symptom',
              addLabel: 'Add Symptom',
              fields: [
                { name: 'title', label: 'Title', type: 'text', required: true },
                { name: 'description', label: 'Description', type: 'textarea', required: true },
                { name: 'icon', label: 'Icon', type: 'select', options: iconOptions },
              ],
            },
          ],
        },
      ],
    },

    {
      id: 'treatment',
      title: 'Section 8 - Options & Comparison (Public: "Treatment Options / Comparison")',
      sections: [
        {
          title: 'Treatment Options',
          fields: [
            {
              name: 'treatmentOptions',
              label: 'Treatment Options',
              type: 'repeatableGroup',
              itemLabel: 'Option',
              addLabel: 'Add Option',
              fields: [
                { name: 'tabName', label: 'Tab Name (Heading)', type: 'text', required: true },
                { name: 'description', label: 'Description', type: 'textarea', required: true },
                { name: 'whoMayBenefit', label: 'Who May Benefit', type: 'textarea' },
                { name: 'recoveryInfo', label: 'Recovery & Guidelines', type: 'textarea' },
                { name: 'icon', label: 'Icon', type: 'select', options: iconOptions },
                { name: 'imageUrl', label: 'Section Image', type: 'image' },
              ],
            },
            {
              name: 'comparisonTable.rows',
              label: 'Comparison Table Rows',
              type: 'repeatableGroup',
              itemLabel: 'Row',
              addLabel: 'Add Row',
              fields: [
                { name: 'label', label: 'Label', type: 'text' },
                { name: 'colA', label: 'Column A', type: 'text' },
                { name: 'colB', label: 'Column B', type: 'text' },
                { name: 'colC', label: 'Column C', type: 'text' },
              ],
            },
            { name: 'duration', label: 'Duration Badge', type: 'text' },
            { name: 'successRate', label: 'Success Rate Badge', type: 'text' },
          ],
        },
      ],
    },
    {
      id: 'whyChoose',
      title: 'Section 9 - Why Choose Sreya (Public: "Sreya Care Values / Why Choose Sreya")',
      sections: [
        {
          title: 'Why Choose Overrides',
          fields: [
            {
              name: 'whyChooseOverride',
              label: 'Service-Specific Trust Blocks',
              type: 'repeatableGroup',
              itemLabel: 'Block',
              addLabel: 'Add Trust Block',
              fields: [
                { name: 'heading', label: 'Heading', type: 'text' },
                { name: 'body', label: 'Body', type: 'textarea' },
                { name: 'iconKey', label: 'Icon', type: 'select', options: iconOptions },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'prevention',
      title: 'Section 10 - Prevention & Lifestyle Tips (Public: "Prevention & Lifestyle Support")',
      sections: [{ title: 'Prevention Tips', fields: [{ name: 'preventionTips', label: 'Tips', type: 'richBulletList', addLabel: 'Add Tip' }] }],
    },
    {
      id: 'closing',
      title: 'Section 11 - Frequently Asked Questions (Public: "FAQs")',
      sections: [
        {
          title: 'FAQs',
          fields: [
            { name: 'faqs', label: 'FAQs', type: 'repeatableGroup', fields: faqFields, itemLabel: 'FAQ', addLabel: 'Add FAQ' },
          ],
        },
      ],
    },
    {
      id: 'gallery',
      title: 'Section 12 - Photo Gallery (Public: "Photo Gallery / Images")',
      sections: [
        {
          title: 'Gallery Images',
          fields: [
            {
              name: 'gallery',
              label: 'Gallery Images',
              type: 'repeatableGroup',
              itemLabel: 'Image',
              addLabel: 'Add Image',
              fields: [
                { name: 'imageUrl', label: 'Image', type: 'image', required: true },
                { name: 'caption', label: 'Caption', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
  ]
}

export function settingsSchema() {
  return [
    {
      title: 'Hospital Info',
      columns: 2,
      fields: [
        { name: 'hospitalName', label: 'Hospital Name', type: 'text', required: true },
        { name: 'tagline', label: 'Tagline', type: 'textarea' },
        { name: 'practicingSinceYear', label: 'Practicing Since Year', type: 'number' },
        { name: 'doctorExperienceYears', label: 'Doctor Experience Years', type: 'number' },
        { name: 'phone', label: 'Phone', type: 'text' },
        { name: 'whatsapp', label: 'WhatsApp Number', type: 'text' },
        { name: 'email', label: 'Email', type: 'text' },
        { name: 'address', label: 'Address', type: 'textarea' },
        { name: 'businessHours', label: 'Business Hours', type: 'textarea' },
        { name: 'mapEmbedUrl', label: 'Google Map Embed URL', type: 'text' },
        { name: 'logoUrl', label: 'Logo', type: 'image' },
        { name: 'googleReviewUrl', label: 'Google Review URL', type: 'text' },
        { name: 'googleRating', label: 'Google Rating Score', type: 'text' },
        { name: 'googleReviewCount', label: 'Google Reviews Count', type: 'text' },
        { name: 'maintenanceMode', label: 'Maintenance Mode', type: 'boolean' },
      ],
    },
    {
      title: 'Hospital Moments Videos',
      description: 'Autoplaying video files at the bottom of the Home page.',
      columns: 2,
      fields: [
        { name: 'hospitalMomentsVideo1', label: 'Moments Video 1 URL / Path', type: 'image', hint: 'Default: /videos/hospital-moments-1.mp4' },
        { name: 'hospitalMomentsVideo2', label: 'Moments Video 2 URL / Path', type: 'image', hint: 'Default: /videos/hospital-moments-2.mp4' },
      ],
    },
    {
      title: 'SEO',
      columns: 2,
      fields: [
        { name: 'seo.title', label: 'SEO Title', type: 'text', maxLength: 70 },
        { name: 'seo.description', label: 'SEO Description', type: 'textarea', maxLength: 160 },
        { name: 'seo.ogImage', label: 'Social Share Image', type: 'image' },
      ],
    },
    {
      title: 'Page Banners',
      description: 'Header banners displayed at the top of public sub-pages.',
      columns: 2,
      fields: [
        { name: 'pageBanners.about.badge', label: 'About Badge', type: 'text' },
        { name: 'pageBanners.about.title', label: 'About Title', type: 'text' },
        { name: 'pageBanners.about.subtitle', label: 'About Subtitle', type: 'textarea' },
        { name: 'pageBanners.about.imageUrl', label: 'About Banner Image', type: 'image' },
        { name: 'pageBanners.about.breadcrumb', label: 'About Breadcrumb Label', type: 'text' },
        
        { name: 'pageBanners.services.badge', label: 'Services Badge', type: 'text' },
        { name: 'pageBanners.services.title', label: 'Services Title', type: 'text' },
        { name: 'pageBanners.services.subtitle', label: 'Services Subtitle', type: 'textarea' },
        { name: 'pageBanners.services.imageUrl', label: 'Services Banner Image', type: 'image' },
        { name: 'pageBanners.services.breadcrumb', label: 'Services Breadcrumb Label', type: 'text' },

        { name: 'pageBanners.doctors.badge', label: 'Doctors Badge', type: 'text' },
        { name: 'pageBanners.doctors.title', label: 'Doctors Title', type: 'text' },
        { name: 'pageBanners.doctors.subtitle', label: 'Doctors Subtitle', type: 'textarea' },
        { name: 'pageBanners.doctors.imageUrl', label: 'Doctors Banner Image', type: 'image' },
        { name: 'pageBanners.doctors.breadcrumb', label: 'Doctors Breadcrumb Label', type: 'text' },

        { name: 'pageBanners.freeCamp.badge', label: 'Free Camp Badge', type: 'text' },
        { name: 'pageBanners.freeCamp.title', label: 'Free Camp Title', type: 'text' },
        { name: 'pageBanners.freeCamp.subtitle', label: 'Free Camp Subtitle', type: 'textarea' },
        { name: 'pageBanners.freeCamp.imageUrl', label: 'Free Camp Banner Image', type: 'image' },
        { name: 'pageBanners.freeCamp.breadcrumb', label: 'Free Camp Breadcrumb Label', type: 'text' },

        { name: 'pageBanners.successStories.badge', label: 'Success Stories Badge', type: 'text' },
        { name: 'pageBanners.successStories.title', label: 'Success Stories Title', type: 'text' },
        { name: 'pageBanners.successStories.subtitle', label: 'Success Stories Subtitle', type: 'textarea' },
        { name: 'pageBanners.successStories.imageUrl', label: 'Success Stories Banner Image', type: 'image' },
        { name: 'pageBanners.successStories.breadcrumb', label: 'Success Stories Breadcrumb Label', type: 'text' },

        { name: 'pageBanners.gallery.badge', label: 'Gallery Badge', type: 'text' },
        { name: 'pageBanners.gallery.title', label: 'Gallery Title', type: 'text' },
        { name: 'pageBanners.gallery.subtitle', label: 'Gallery Subtitle', type: 'textarea' },
        { name: 'pageBanners.gallery.imageUrl', label: 'Gallery Banner Image', type: 'image' },
        { name: 'pageBanners.gallery.breadcrumb', label: 'Gallery Breadcrumb Label', type: 'text' },

        { name: 'pageBanners.blog.badge', label: 'Blog Badge', type: 'text' },
        { name: 'pageBanners.blog.title', label: 'Blog Title', type: 'text' },
        { name: 'pageBanners.blog.subtitle', label: 'Blog Subtitle', type: 'textarea' },
        { name: 'pageBanners.blog.imageUrl', label: 'Blog Banner Image', type: 'image' },
        { name: 'pageBanners.blog.breadcrumb', label: 'Blog Breadcrumb Label', type: 'text' },

        { name: 'pageBanners.faq.badge', label: 'FAQ Badge', type: 'text' },
        { name: 'pageBanners.faq.title', label: 'FAQ Title', type: 'text' },
        { name: 'pageBanners.faq.subtitle', label: 'FAQ Subtitle', type: 'textarea' },
        { name: 'pageBanners.faq.imageUrl', label: 'FAQ Banner Image', type: 'image' },
        { name: 'pageBanners.faq.breadcrumb', label: 'FAQ Breadcrumb Label', type: 'text' },

        { name: 'pageBanners.contact.badge', label: 'Contact Badge', type: 'text' },
        { name: 'pageBanners.contact.title', label: 'Contact Title', type: 'text' },
        { name: 'pageBanners.contact.subtitle', label: 'Contact Subtitle', type: 'textarea' },
        { name: 'pageBanners.contact.imageUrl', label: 'Contact Banner Image', type: 'image' },
        { name: 'pageBanners.contact.breadcrumb', label: 'Contact Breadcrumb Label', type: 'text' },

        { name: 'pageBanners.appointment.badge', label: 'Appointment Badge', type: 'text' },
        { name: 'pageBanners.appointment.title', label: 'Appointment Title', type: 'text' },
        { name: 'pageBanners.appointment.subtitle', label: 'Appointment Subtitle', type: 'textarea' },
        { name: 'pageBanners.appointment.imageUrl', label: 'Appointment Banner Image', type: 'image' }
      ]
    },
    {
      title: 'Home Bridge Parallax',
      columns: 2,
      fields: [
        { name: 'homeBridgeSection.badgeText', label: 'Badge Text', type: 'text' },
        { name: 'homeBridgeSection.title', label: 'Section Title', type: 'text' },
        { name: 'homeBridgeSection.body', label: 'Body Description', type: 'textarea' },
        { name: 'homeBridgeSection.bridgeImageUrl', label: 'Bridge Background Image', type: 'image' },
        { name: 'homeBridgeSection.overlayColor', label: 'Overlay Color', type: 'colorToken' },
        { name: 'homeBridgeSection.overlayOpacity', label: 'Overlay Opacity (0-1 or 0-100)', type: 'number' },
        { name: 'homeBridgeSection.primaryButtonLabel', label: 'Primary Button Label', type: 'text' },
        { name: 'homeBridgeSection.primaryButtonLink', label: 'Primary Button Link', type: 'text' },
        { name: 'homeBridgeSection.secondaryButtonLabel', label: 'Secondary Button Label', type: 'text' },
        { name: 'homeBridgeSection.secondaryButtonLink', label: 'Secondary Button Link', type: 'text' }
      ]
    },
    {
      title: 'Parallax Experience (Stats Background)',
      columns: 2,
      fields: [
        { name: 'parallaxExperience.badgeText', label: 'Badge Text', type: 'text' },
        { name: 'parallaxExperience.title', label: 'Section Title', type: 'text' },
        { name: 'parallaxExperience.body', label: 'Body Description', type: 'textarea' },
        { name: 'parallaxExperience.imageUrl', label: 'Background Image', type: 'image' }
      ]
    },
    {
      title: 'Utility Bar',
      fields: [
        { name: 'utilityBar.enabled', label: 'Show Utility Bar', type: 'boolean' },
        { name: 'utilityBar.phoneLabel', label: 'Phone Label', type: 'text' },
        { name: 'utilityBar.appointmentLabel', label: 'Appointment Button Label', type: 'text' },
        { name: 'utilityBar.appointmentLink', label: 'Appointment Button Link', type: 'text' },
        {
          name: 'utilityBar.leftLinks',
          label: 'Left Links',
          type: 'repeatableGroup',
          itemLabel: 'Link',
          addLabel: 'Add Link',
          fields: [
            { name: 'label', label: 'Label', type: 'text' },
            { name: 'href', label: 'Link', type: 'text' },
            { name: 'iconKey', label: 'Icon', type: 'select', options: iconOptions },
          ],
        },
      ],
    },
    {
      title: 'Navigation',
      fields: [
        {
          name: 'navItems',
          label: 'Navbar Links',
          type: 'repeatableGroup',
          itemLabel: 'Nav Link',
          addLabel: 'Add Nav Link',
          fields: [
            { name: 'label', label: 'Label', type: 'text' },
            { name: 'href', label: 'Link', type: 'text' },
          ],
        },
      ],
    },
    {
      title: 'Home Copy',
      columns: 2,
      fields: [
        { name: 'expertiseSection.eyebrow', label: 'Expertise Eyebrow', type: 'text' },
        { name: 'expertiseSection.title', label: 'Expertise Title', type: 'text' },
        { name: 'expertiseSection.body', label: 'Expertise Body', type: 'textarea' },
        { name: 'expertiseSection.buttonLabel', label: 'Expertise Button Label', type: 'text' },
        { name: 'trustSection.eyebrow', label: 'Trust Eyebrow', type: 'text' },
        { name: 'trustSection.title', label: 'Trust Title', type: 'text' },
        { name: 'trustSection.body', label: 'Trust Body', type: 'textarea' },
        { name: 'differentiatorSection.eyebrow', label: 'Differentiator Eyebrow', type: 'text' },
        { name: 'differentiatorSection.title', label: 'Differentiator Title', type: 'text' },
        { name: 'differentiatorSection.body', label: 'Differentiator Body', type: 'textarea' },
        { name: 'testimonialSection.title', label: 'Testimonials Title', type: 'text' },
        { name: 'testimonialSection.body', label: 'Testimonials Body', type: 'textarea' },
        { name: 'testimonialSection.galleryTitle', label: 'Success Gallery Title', type: 'text' },
        { name: 'testimonialSection.galleryBody', label: 'Success Gallery Body', type: 'textarea' },
        { name: 'ctaSection.title', label: 'CTA Title', type: 'text' },
        { name: 'ctaSection.body', label: 'CTA Body', type: 'textarea' },
      ],
    },
    {
      title: 'Google Reviews',
      fields: [
        {
          name: 'googleReviews',
          label: 'Real Google Review Cards',
          type: 'repeatableGroup',
          itemLabel: 'Review',
          addLabel: 'Add Review',
          fields: [
            { name: 'author', label: 'Author', type: 'text' },
            { name: 'text', label: 'Review Text', type: 'textarea' },
            { name: 'rating', label: 'Rating', type: 'number' },
            { name: 'order', label: 'Display Order', type: 'number' },
          ],
        },
      ],
    },
    {
      title: 'Hero Stats',
      fields: [
        {
          name: 'heroStats',
          label: 'Hero Stats',
          type: 'repeatableGroup',
          itemLabel: 'Stat',
          addLabel: 'Add Stat',
          fields: [
            { name: 'label', label: 'Label', type: 'text' },
            { name: 'value', label: 'Value', type: 'text' },
            { name: 'suffix', label: 'Suffix', type: 'text' },
            { name: 'iconKey', label: 'Icon', type: 'select', options: iconOptions },
            { name: 'iconUrl', label: 'Custom Icon', type: 'image' },
          ],
        },
      ],
    },
    {
      title: 'About Page',
      fields: [
        { name: 'aboutPage.eyebrow', label: 'About Eyebrow', type: 'text' },
        { name: 'aboutPage.title', label: 'About Title', type: 'text' },
        { name: 'aboutPage.paragraphs', label: 'About Paragraphs', type: 'richBulletList', addLabel: 'Add Paragraph' },
        {
          name: 'aboutPage.milestones',
          label: 'Milestones',
          type: 'repeatableGroup',
          itemLabel: 'Milestone',
          addLabel: 'Add Milestone',
          fields: [
            { name: 'year', label: 'Year', type: 'number' },
            { name: 'title', label: 'Title', type: 'text' },
            { name: 'description', label: 'Description', type: 'textarea' },
          ],
        },
      ],
    },
  ]
}

export function facilitySchema() {
  return [
    {
      title: 'Facility Basics',
      columns: 2,
      fields: [
        { name: 'title', label: 'Section Title', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'videoUrl', label: 'Video URL or Path (Optional)', type: 'text', hint: 'e.g., /videos/facility.mp4 or a Firebase storage URL' },
        { name: 'order', label: 'Display Order', type: 'number' },
        { name: 'active', label: 'Show Facility', type: 'boolean' },
      ],
    },
    {
      title: 'Image Gallery',
      fields: [
        {
          name: 'images',
          label: 'Gallery Images',
          type: 'repeatableGroup',
          itemLabel: 'Image',
          addLabel: 'Add Image',
          fields: [
            { name: 'imageUrl', label: 'Image', type: 'image', required: true },
            { name: 'altText', label: 'Alt Text', type: 'text' },
          ],
        },
      ],
    },
    {
      title: 'Amenities (Optional, e.g. for Rooms)',
      fields: [
        { name: 'amenities', label: 'Amenities list', type: 'richBulletList', addLabel: 'Add Amenity' }
      ]
    }
  ]
}

export function doctorsPageSchema() {
  return [
    {
      title: 'Hero Slideshow',
      description: '3 rotating hero images and text headers at the top of the Doctors page.',
      columns: 2,
      fields: [
        { name: 'doctorsPage.heroTitle', label: 'Hero Title', type: 'text' },
        { name: 'doctorsPage.heroSubtitle', label: 'Hero Subtitle', type: 'textarea' },
        { name: 'doctorsPage.heroImage1', label: 'Hero Image 1', type: 'image' },
        { name: 'doctorsPage.heroImage2', label: 'Hero Image 2', type: 'image' },
        { name: 'doctorsPage.heroImage3', label: 'Hero Image 3', type: 'image' },
      ],
    },
    {
      title: 'Advanced Way Section',
      description: 'Explain Sreya\'s technology, methodology, and specialized treatment approaches.',
      columns: 2,
      fields: [
        { name: 'doctorsPage.advancedHeading', label: 'Section Heading', type: 'text' },
        { name: 'doctorsPage.advancedBody', label: 'Section Body Text', type: 'textarea' },
      ],
    },
    {
      title: 'Team Behind Every Success Section',
      description: 'Introductory text and supporting images above the doctor profiles grid.',
      columns: 2,
      fields: [
        { name: 'doctorsPage.teamHeading', label: 'Section Heading', type: 'text' },
        { name: 'doctorsPage.teamBody', label: 'Section Body Text', type: 'textarea' },
        { name: 'doctorsPage.teamImage', label: 'Supporting Image', type: 'image' },
      ],
    },
  ]
}

export const departmentOptions = departments.map((department) => ({ label: department.name, value: department.name }))

export function procedurePathwaySchema() {
  return [
    {
      title: 'Step Details',
      columns: 2,
      fields: [
        { name: 'title', label: 'Step Title', type: 'text', required: true },
        { name: 'order', label: 'Display Order', type: 'number' },
        { name: 'active', label: 'Active', type: 'boolean' },
      ],
    },
    {
      title: 'Content & Media',
      fields: [
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'imageUrl', label: 'Section Image (Optional)', type: 'image' },
      ],
    },
  ]
}

export function bannerSchema() {
  return [
    {
      title: 'Banner Details',
      columns: 2,
      fields: [
        { name: 'order', label: 'Display Order', type: 'number' },
        { name: 'active', label: 'Active', type: 'boolean' },
      ],
    },
    {
      title: 'Image',
      fields: [
        { name: 'imageUrl', label: 'Banner Image', type: 'image', required: true },
      ],
    },
  ]
}

export function festivalBannerSchema() {
  return [
    {
      title: 'Status',
      fields: [
        { name: 'enabled', label: 'Enable Website Intro Popup', type: 'boolean' },
      ],
    },
    {
      title: 'Banner Frame Image',
      fields: [
        { name: 'imageUrl', label: 'Popup Image', type: 'image', required: true },
      ],
    },
    {
      title: 'Attribution & Content',
      columns: 2,
      fields: [
        { name: 'text', label: 'Attribution Text (e.g. Website designed by Wayzentech)', type: 'text' },
        { name: 'phone', label: 'Phone Number', type: 'text' },
        { name: 'link', label: 'Click Action Link (Optional)', type: 'text' },
      ],
    },
  ]
}

export function journeyTimelineSchema() {
  return [
    {
      title: 'Timeline Introduction & Layout Banners',
      fields: [
        { name: 'journeyTitle', label: 'Section Title (e.g. Sreya\'s Journey)', type: 'text', required: true },
        { name: 'journeyTagline', label: 'Tagline / Description', type: 'textarea' },
        { name: 'journeyIntroImage1', label: 'Square Intro Photo 1 (e.g. Top-Right)', type: 'image' },
        { name: 'journeyIntroImage2', label: 'Square Intro Photo 2 (e.g. Bottom-Left)', type: 'image' },
      ],
    },
    {
      title: 'Timeline Milestone Blocks',
      description: 'Add, edit, or delete milestones (e.g., 2007, 2010-2016, 2017, 2026).',
      fields: [
        {
          name: 'journeyMilestones',
          label: 'Milestones',
          type: 'repeatableGroup',
          itemLabel: 'Milestone',
          addLabel: 'Add Milestone',
          fields: [
            { name: 'year', label: 'Year Label (e.g., 2007 or 2010–2016)', type: 'text', required: true },
            { name: 'date', label: 'Date Label (e.g., January 21, 2007)', type: 'text' },
            { name: 'description', label: 'Description', type: 'textarea', required: true },
            { name: 'bulletsText', label: 'Bullet Points (one per line)', type: 'textarea', hint: 'Type each bullet point on a separate line.' },
            { name: 'image1', label: 'Milestone Image 1', type: 'image' },
            { name: 'image2', label: 'Milestone Image 2', type: 'image' },
            { name: 'image3', label: 'Milestone Image 3', type: 'image' },
            { name: 'image4', label: 'Milestone Image 4', type: 'image' },
            { name: 'image5', label: 'Milestone Image 5', type: 'image' },
          ],
        },
      ],
    },
    {
      title: 'Milestones Achieved Stats',
      columns: 2,
      fields: [
        { name: 'journeyStats.deliveries', label: 'Deliveries Count (e.g., 6000+)', type: 'text' },
        { name: 'journeyStats.infertility', label: 'Infertility Treatments (e.g., 10000+)', type: 'text' },
        { name: 'journeyStats.laparoscopic', label: 'Laparoscopic Surgeries (e.g., 7000+)', type: 'text' },
        { name: 'journeyStats.camps', label: 'Free Medical Camps (e.g., 1500+)', type: 'text' },
        { name: 'journeyStats.tagline', label: 'Stats Banner Tagline', type: 'text' }
      ],
    },
    {
      title: 'Doctor Profile for Journey Section',
      columns: 2,
      fields: [
        { name: 'journeyDoctor.name', label: 'Doctor Name', type: 'text' },
        { name: 'journeyDoctor.qualifications', label: 'Qualifications (one per line or comma-separated)', type: 'textarea' },
        { name: 'journeyDoctor.photoUrl', label: 'Doctor Profile Photo', type: 'image' }
      ]
    }
  ]
}
