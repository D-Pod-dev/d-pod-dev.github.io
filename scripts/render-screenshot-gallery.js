(function () {
    var galleries = document.querySelectorAll('[data-screenshot-gallery]');

    if (!galleries.length) {
        return;
    }

    Array.prototype.forEach.call(galleries, initGallery);

    function initGallery(gallery) {
        var dataScript = gallery.querySelector('script[type="application/json"]');
        if (!dataScript) {
            return;
        }

        var items;

        try {
            items = JSON.parse(dataScript.textContent || '[]');
        } catch (error) {
            console.error('Failed to parse screenshot gallery data', error);
            return;
        }

        if (!items || !items.length) {
            return;
        }

        items = items.slice().sort(function (left, right) {
            return String(left.name || left.src || '').localeCompare(String(right.name || right.src || ''), undefined, {
                numeric: true,
                sensitivity: 'base'
            });
        });

        var currentIndex = 0;
        var shell = document.createElement('div');
        shell.className = 'screenshot-gallery__shell';

        var prevButton = createArrowButton('Previous screenshot', 'prev');
        var nextButton = createArrowButton('Next screenshot', 'next');

        var figure = document.createElement('figure');
        figure.className = 'screenshot-gallery__frame';

        var image = document.createElement('img');
        image.className = 'screenshot-gallery__image';
        image.alt = '';
        image.loading = 'lazy';

        var caption = document.createElement('figcaption');
        caption.className = 'screenshot-gallery__caption';

        var title = document.createElement('h3');
        var description = document.createElement('p');
        var meta = document.createElement('span');
        meta.className = 'screenshot-gallery__meta';

        caption.appendChild(title);
        caption.appendChild(description);
        caption.appendChild(meta);
        figure.appendChild(image);

        shell.appendChild(prevButton);
        shell.appendChild(figure);
        shell.appendChild(nextButton);

        gallery.innerHTML = '';
        gallery.appendChild(shell);
        gallery.appendChild(caption);

        gallery.tabIndex = 0;
        gallery.setAttribute('role', 'region');
        gallery.setAttribute('aria-label', 'Screenshot gallery');

        prevButton.addEventListener('click', function () {
            setIndex(currentIndex - 1);
        });

        nextButton.addEventListener('click', function () {
            setIndex(currentIndex + 1);
        });

        gallery.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                setIndex(currentIndex - 1);
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault();
                setIndex(currentIndex + 1);
            }
        });

        setIndex(0);

        function setIndex(nextIndex) {
            currentIndex = (nextIndex + items.length) % items.length;

            var item = items[currentIndex];
            image.src = item.src;
            image.alt = item.title ? item.title + ' screenshot' : 'Screenshot';
            title.textContent = item.title || 'Screenshot';
            description.textContent = item.description || '';
            meta.textContent = (currentIndex + 1) + ' / ' + items.length;

            prevButton.disabled = items.length < 2;
            nextButton.disabled = items.length < 2;
        }

        function createArrowButton(label, direction) {
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'gallery-arrow';
            button.setAttribute('aria-label', label);

            var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            icon.setAttribute('viewBox', '0 0 24 24');
            icon.setAttribute('aria-hidden', 'true');
            icon.setAttribute('focusable', 'false');

            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('fill', 'currentColor');

            if (direction === 'prev') {
                path.setAttribute('d', 'M15.7 4.3a1 1 0 0 1 0 1.4L10.41 11H20a1 1 0 1 1 0 2h-9.59l5.3 5.3a1 1 0 1 1-1.42 1.4l-7-7a1 1 0 0 1 0-1.4l7-7a1 1 0 0 1 1.41 0Z');
            } else {
                path.setAttribute('d', 'M8.3 19.7a1 1 0 0 1 0-1.4L13.59 13H4a1 1 0 1 1 0-2h9.59l-5.3-5.3a1 1 0 1 1 1.42-1.4l7 7a1 1 0 0 1 0 1.4l-7 7a1 1 0 0 1-1.41 0Z');
            }

            icon.appendChild(path);
            button.appendChild(icon);

            return button;
        }
    }
})();