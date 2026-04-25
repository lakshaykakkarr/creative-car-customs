import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

const singletons = ['siteSettings', 'homePage']

export default defineConfig({
  name: 'creative-car-customs',
  title: 'Creative Car Customs',
  projectId: 'w4fgl3xy',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings'),
              ),
            S.listItem()
              .title('Home Page')
              .id('homePage')
              .child(
                S.document()
                  .schemaType('homePage')
                  .documentId('homePage'),
              ),
            S.divider(),
            S.documentTypeListItem('pageContent').title('Page Content'),
            S.documentTypeListItem('businessHours').title('Business Hours'),
            S.divider(),
            S.documentTypeListItem('service').title('Services'),
            S.documentTypeListItem('serviceCategory').title('Service Categories'),
            S.documentTypeListItem('servicePackage').title('Service Packages'),
            S.divider(),
            S.listItem()
              .title('Testimonials & Feedback')
              .child(
                S.list()
                  .title('Testimonials & Feedback')
                  .items([
                    S.listItem()
                      .title('Pending Review')
                      .child(
                        S.documentList()
                          .title('Pending Review')
                          .filter('_type == "testimonial" && status == "pending"')
                          .schemaType('testimonial'),
                      ),
                    S.listItem()
                      .title('Approved')
                      .child(
                        S.documentList()
                          .title('Approved')
                          .filter('_type == "testimonial" && status == "approved"')
                          .schemaType('testimonial'),
                      ),
                    S.listItem()
                      .title('Discarded')
                      .child(
                        S.documentList()
                          .title('Discarded')
                          .filter('_type == "testimonial" && status == "discarded"')
                          .schemaType('testimonial'),
                      ),
                    S.divider(),
                    S.documentTypeListItem('testimonial').title('All Testimonials'),
                  ]),
              ),
            S.documentTypeListItem('galleryItem').title('Gallery Items'),
            S.documentTypeListItem('beforeAfterSlider').title('Before & After Sliders'),
            S.divider(),
            S.documentTypeListItem('teamMember').title('Team Members'),
            S.documentTypeListItem('stat').title('Stats'),
            S.documentTypeListItem('faqItem').title('FAQs'),
            S.documentTypeListItem('serviceArea').title('Service Areas'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletons.includes(schemaType)),
  },

  document: {
    actions: (input, context) =>
      singletons.includes(context.schemaType)
        ? input.filter(({ action }) =>
            action ? ['publish', 'discardChanges', 'restore'].includes(action) : false,
          )
        : input,
  },
})
