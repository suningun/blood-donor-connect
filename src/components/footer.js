export const renderFooter = (container) => {
  container.innerHTML = `
    <footer class="border-t border-neutral/10 mt-10 bg-white">
      <div class="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-neutral/50">
        <p>Blood Donor Connect — INFO 251 Class Project</p>
        <p class="mt-1">All data is synthetic/test data, not a real medical service</p>
      </div>
    </footer>
  `;
};