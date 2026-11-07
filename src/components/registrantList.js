export const registrantList = (registrants) => `
  <div class="space-y-2">
    ${registrants.length
      ? registrants.map((r) => `
        <div class="border border-neutral/20 p-3 rounded-md text-sm">
          <p class="font-medium text-neutral">${r.name} — ${r.gender}, ${r.age}y, ${r.weight}kg</p>
          <p class="text-neutral/60">${r.phone}</p>
          <p class="text-neutral/60">Health: ${r.healthCondition || "None reported"}</p>
        </div>
      `).join("")
      : `<p class="text-neutral/50 text-sm">No registrants yet.</p>`
    }
  </div>
`;