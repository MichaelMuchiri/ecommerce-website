import React from 'react';
import { useProducts } from '../../context/ProductContext';
import './ProductPagination.css';

const ProductPagination = () => {
  const { pagination, filters, updateFilters } = useProducts();
  const { page, pages } = pagination;

  if (pages <= 1) return null;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      updateFilters({ page: newPage });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <div className="pagination">
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="page-btn prev"
      >
        <i className="fas fa-chevron-left"></i>
        Previous
      </button>

      <div className="page-numbers">
        {getPageNumbers().map((item, index) => (
          <button
            key={index}
            onClick={() => typeof item === 'number' && handlePageChange(item)}
            className={`page-number ${item === page ? 'active' : ''} ${
              typeof item !== 'number' ? 'dots' : ''
            }`}
            disabled={typeof item !== 'number'}
          >
            {item}
          </button>
        ))}
      </div>

      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === pages}
        className="page-btn next"
      >
        Next
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default ProductPagination;