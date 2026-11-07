export const postCard = (post) => `
    <div class="border rounded-lg p-4 shadow-sm bg-white">
        <div class="flex justify-between items-start">
        <h3 class="font-headline font-bold text-lg">${post.hospitalName}</h3>
        <span class="px-2 py-1 text-xs rounded ${post.status === "active" ? "bg-secondary/10 text-secondary" : "bg-neutral/10 text-neutral/60"}">
            ${post.status === "active" ? "Active" : "Fulfilled"}
        </span>
        </div>
        <p class="text-2xl font-headline font-bold text-primary mt-2">${post.bloodType}</p>
        <p class="text-sm text-neutral/70">${post.unitsNeeded} units needed</p>
        <p class="text-sm text-neutral/70">${post.province}</p>
        <a href="/post/${post.id}" data-link class="inline-block mt-3 text-tertiary text-sm font-medium">View Details →</a>
    </div>
`;