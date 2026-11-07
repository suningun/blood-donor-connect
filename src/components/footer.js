export const renderFooter = (container) => {
  container.innerHTML = `
    <footer class="mt-16 border-t border-neutral/10 bg-white">
      <div class="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p class="font-headline text-lg font-bold text-primary">Blood Donor Connect</p>
          <p class="mt-2 max-w-xs text-sm leading-6 text-neutral/55">A simple way for donors and hospitals to connect when blood is needed most.</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-neutral">Explore</p>
          <div class="mt-3 flex flex-col gap-2 text-sm text-neutral/60">
            <a href="/" data-link class="transition hover:text-primary">Home</a>
            <a href="/posts" data-link class="transition hover:text-primary">Requests</a>
            <a href="/blood-info" data-link class="transition hover:text-primary">Donation Info</a>
          </div>
        </div>
        <div>
          <p class="text-sm font-semibold text-neutral">About this project</p>
          <p class="mt-3 text-sm leading-6 text-neutral/55">INFO 251 Class Project. All data is synthetic/test data, not a real medical service.</p>
        </div>
      </div>
      <div class="border-t border-neutral/10 px-4 py-4 text-center text-xs text-neutral/45">Made to make every donation count.</div>
    </footer>
  `;
};