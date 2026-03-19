import React from 'react';
import { Helmet } from 'react-helmet-async';

const SchemaMarkup = ({ type = 'WebSite', data }) => {
  const generateSchema = () => {
    switch (type) {
      case 'WebSite':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'EcoShop',
          url: 'https://ecommerce-frontend.vercel.app',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://ecommerce-frontend.vercel.app/shop?keyword={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          }
        };

      case 'Product':
        return {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: data?.name || 'Product',
          description: data?.description || '',
          image: data?.images?.map(img => img.url) || [],
          sku: data?.sku || '',
          brand: {
            '@type': 'Brand',
            name: data?.brand || 'EcoShop'
          },
          offers: {
            '@type': 'Offer',
            price: data?.price || 0,
            priceCurrency: 'USD',
            availability: data?.quantity > 0 
              ? 'https://schema.org/InStock' 
              : 'https://schema.org/OutOfStock',
            url: `https://ecommerce-frontend.vercel.app/product/${data?.slug || data?._id || ''}`
          },
          aggregateRating: data?.ratings?.count > 0 ? {
            '@type': 'AggregateRating',
            ratingValue: data?.ratings?.average || 0,
            reviewCount: data?.ratings?.count || 0
          } : undefined
        };

      case 'Organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'EcoShop',
          url: 'https://ecommerce-frontend.vercel.app',
          logo: 'https://ecommerce-frontend.vercel.app/logo.png',
          sameAs: [
            'https://facebook.com/ecoshop',
            'https://twitter.com/ecoshop',
            'https://instagram.com/ecoshop'
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+1-800-123-4567',
            contactType: 'customer service',
            areaServed: 'US',
            availableLanguage: 'English'
          }
        };

      case 'BreadcrumbList':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data?.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `https://ecommerce-frontend.vercel.app${item.path}`
          })) || []
        };

      default:
        return null;
    }
  };

  const schema = generateSchema();

  if (!schema) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default SchemaMarkup;