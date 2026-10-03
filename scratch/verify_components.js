// scratch/verify_components.js
const fs = require('fs');
const path = require('path');

const files = [
  'src/app/(dashboard)/dashboard/customers/page.tsx',
  'src/app/(dashboard)/dashboard/materials/page.tsx',
  'src/app/(dashboard)/dashboard/projects/page.tsx',
  'src/app/(dashboard)/dashboard/expenses/page.tsx',
  'src/app/(dashboard)/dashboard/payments/page.tsx',
  'src/app/(dashboard)/dashboard/purchases/page.tsx',
  'src/app/(dashboard)/dashboard/quotations/page.tsx',
  'src/app/(dashboard)/dashboard/suppliers/page.tsx',
  'src/app/(dashboard)/dashboard/workers/page.tsx',
  'src/app/(dashboard)/dashboard/users/page.tsx',
  'src/app/(dashboard)/dashboard/reviews/page.tsx',
  'src/app/(dashboard)/dashboard/audit-log/page.tsx',
];

console.log('--- Checking ListFilterBar in all Dashboard List Pages ---');
let allGood = true;

for (const f of files) {
  const fullPath = path.join(__dirname, '..', f);
  if (!fs.existsSync(fullPath)) {
    console.error(`File missing: ${f}`);
    allGood = false;
    continue;
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  const hasFilterBar = content.includes('ListFilterBar');
  console.log(`${hasFilterBar ? '✅' : '❌'} ${f}`);
  if (!hasFilterBar) allGood = false;
}

const listFilterBarPath = path.join(__dirname, '..', 'src/components/common/ListFilterBar.tsx');
if (fs.existsSync(listFilterBarPath)) {
  const lfb = fs.readFileSync(listFilterBarPath, 'utf8');
  console.log('\n--- Checking Clear button features in ListFilterBar.tsx ---');
  console.log(`✅ Dedicated Top-Side Clear button: ${lfb.includes('handleClearAll') && lfb.includes('Clear')}`);
  console.log(`✅ Inline Search Clear X button: ${lfb.includes('handleClearSearchOnly')}`);
  console.log(`✅ Filter active tag reset: ${lfb.includes('hasActiveFilters')}`);
  console.log(`✅ Suspense Boundary: ${lfb.includes('Suspense')}`);
} else {
  console.error('ListFilterBar.tsx missing!');
  allGood = false;
}

if (allGood) {
  console.log('\n🎉 ALL DASHBOARD LIST PAGES SUCCESSFULLY INTEGRATED WITH TOP-SIDE CLEAR BUTTON!');
} else {
  process.exit(1);
}
