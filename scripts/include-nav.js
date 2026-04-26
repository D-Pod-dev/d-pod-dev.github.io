(function () {
    var navMount = document.getElementById('site-nav');
    if (!navMount) {
        return;
    }

    fetch('/components/nav.html')
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Failed to load shared nav');
            }
            return response.text();
        })
        .then(function (html) {
            navMount.innerHTML = html;
            setActiveNavLink();
        })
        .catch(function (error) {
            console.error(error);
        });

    function setActiveNavLink() {
        var path = window.location.pathname.replace(/index\.html$/, '');
        var isProjects = path.indexOf('/projects') === 0;
        var activeKey = isProjects ? 'projects' : 'home';

        var activeLink = navMount.querySelector('[data-nav-link="' + activeKey + '"]');
        if (activeLink) {
            activeLink.setAttribute('aria-current', 'page');
        }
    }
})();
