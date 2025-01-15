
document.getElementById('searchInput').addEventListener('input', function () {
    const filter = this.value.toLowerCase();
    document.querySelectorAll('.accordion-body ul li').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(filter) ? '' : 'none';
    });
});
