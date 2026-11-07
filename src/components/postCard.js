import { icon } from "../utils/icons.js";
import { cardClass, chipClass } from "../utils/styles.js";

export const postCard = (post) => `
    <article class="${cardClass} group p-5 transition duration-150 hover:-translate-y-1 hover:shadow-lg">
        <div class="flex items-start justify-between gap-3">
        <div class="flex min-w-0 items-center gap-3">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-headline text-lg font-bold text-primary">${post.bloodType}</div>
          <h3 class="truncate font-headline text-base font-bold text-neutral">${post.hospitalName}</h3>
        </div>
        <span class="${chipClass} shrink-0 ${post.status === "active" ? "bg-secondary/10 text-secondary" : "bg-neutral/10 text-neutral/60"}">
            ${post.status === "active" ? "Active" : "Fulfilled"}
        </span>
        </div>
        <div class="mt-5 flex items-center gap-2 text-sm text-neutral/65">
          ${icon("Droplet", { width: 15, height: 15 })}
          <span>${post.unitsNeeded} units needed</span>
        </div>
        <p class="mt-1 text-sm text-neutral/55">${post.province}</p>
        <a href="/post/${post.id}" data-link class="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-tertiary transition group-hover:gap-2">View Details <span aria-hidden="true">→</span></a>
    </article>
`;