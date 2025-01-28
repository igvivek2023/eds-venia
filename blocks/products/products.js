export default async function decorate(block) {
    console.log('Decorate function called');
    
    const productsListBlock = document.querySelector('.products.block');
    console.log('Products list block:', productsListBlock);

    if (!productsListBlock) {
        console.error('Products list block not found');
        return;
    }

    try {
        const formURL = block.querySelector('a[href$=".json"]');

        const response = await fetch(formURL.href);
        const jsonData = await response.json();
        console.log('Fetched JSON data:', jsonData); 

        const productsData = jsonData.data.filter(item => item.path.startsWith('/product/') && item.path !== '/product/');
        console.log('Filtered products data:', productsData); 

        if (!Array.isArray(productsData)) {
            throw new Error('Expected an array in the JSON data but found something else');
        }

        const totalSlide = 4;
        const productChunks = [];
        for (let i = 0; i < productsData.length; i += totalSlide) {
            productChunks.push(productsData.slice(i, i + totalSlide));
        }

        const carouselWrapper = document.createElement('div');
        carouselWrapper.className = 'carousel-wrapper';

        const carousel = document.createElement('div');
        carousel.className = 'carousel';

        const bullets = document.createElement('div');
        bullets.className = 'carousel-bullets';

        productChunks.forEach((chunk, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = `<ul>${
                chunk.map(item => {
                    const title = item.title.toUpperCase();
                    return `
                        <li>
                            <a href="${item.path}" title="${title}">
                                <img src="${item.image}" alt="${title}" />
                                <p>${title}</p>
                                <button>Add to Cart</button>
                            </a>
                        </li>`;
                }).join('')
            }</ul>`;
            carousel.appendChild(slide);

            const bullet = document.createElement('span');
            bullet.className = 'carousel-bullet';
            if (index === 0) bullet.classList.add('active');
            bullet.addEventListener('click', () => {
                slideToIndex(index);
            });
            bullets.appendChild(bullet);
        });

        carouselWrapper.appendChild(carousel);
        carouselWrapper.appendChild(bullets);

        productsListBlock.innerHTML = '';
        productsListBlock.appendChild(carouselWrapper);

        let currentIndex = 0;

        const slideToIndex = (index) => {
            const slides = document.querySelectorAll('.carousel-slide');
            const bullets = document.querySelectorAll('.carousel-bullet');
            const slideWidth = carousel.offsetWidth;

            carousel.style.transform = `translateX(-${index * slideWidth}px)`;

            slides[currentIndex]?.classList.remove('active');
            bullets[currentIndex]?.classList.remove('active');
            slides[index]?.classList.add('active');
            bullets[index]?.classList.add('active');

            currentIndex = index;
        };

        const slides = document.querySelectorAll('.carousel-slide');
        slides[0]?.classList.add('active');
    } catch (error) {
        console.error('Failed to fetch or process JSON data:', error);
    }
}
