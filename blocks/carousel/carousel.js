import { fetchPlaceholders, getMetadata } from '../../scripts/aem.js';

const placeholders = await fetchPlaceholders(getMetadata("locale"));
const { btnNxt, btnPre } = placeholders;

export default function decorate(block) {
  console.log("placeholders ---> ", placeholders, btnNxt, btnPre);

  const rows = Array.from(block.children);

  rows.forEach((row, index) => {
    if (index === 0) {
      const nextBtn = createButton('btn-next', btnNxt);
      row.replaceWith(nextBtn);
    } else if (index === rows.length - 1) {
      const prevBtn = createButton('btn-prev', btnPre);
      row.replaceWith(prevBtn);
    } else {
      row.classList.add('slide');
      Array.from(row.children).forEach((col, colIndex) => {
        if (colIndex === 1) col.classList.add('slide-text');
      });
    }
  });

  const slides = Array.from(document.querySelectorAll(".slide"));
  let curSlide = 0;
  const maxSlide = slides.length - 1;

  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${index * 100}%)`;
  });

  const dotsContainer = document.createElement('div');
  dotsContainer.classList.add('dots');
  block.appendChild(dotsContainer);

  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active'); // Set the first dot as active
    dot.dataset.slide = index; // Assign data-slide attribute
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.children);

  document.querySelector(".btn-next").addEventListener("click", () => {
    curSlide = (curSlide === maxSlide) ? 0 : curSlide + 1;
    updateSlidePosition(slides, curSlide);
    updateDots(dots, curSlide);
  });

  document.querySelector(".btn-prev").addEventListener("click", () => {
    curSlide = (curSlide === 0) ? maxSlide : curSlide - 1;
    updateSlidePosition(slides, curSlide);
    updateDots(dots, curSlide);
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      curSlide = parseInt(dot.dataset.slide, 10);
      updateSlidePosition(slides, curSlide);
      updateDots(dots, curSlide);
    });
  });
}

function createButton(className, textContent) {
  const button = document.createElement('button');
  button.classList.add('btn', className);
  button.textContent = textContent;
  return button;
}

function updateSlidePosition(slides, curSlide) {
  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${100 * (index - curSlide)}%)`;
  });
}

function updateDots(dots, curSlide) {
  dots.forEach(dot => dot.classList.remove('active'));
  dots[curSlide].classList.add('active');
}
