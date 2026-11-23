<!DOCTYPE html>

<html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_dashboard" name="shell-type"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={"darkMode":"class","theme":{"extend":{"colors":{"on-primary-fixed-variant":"#00504a","error-container":"#ffdad6","on-tertiary":"#ffffff","on-secondary-fixed":"#2a1700","inverse-on-surface":"#eef0ff","tertiary":"#7f4025","surface-dim":"#d2d9f4","on-tertiary-container":"#ffe5db","on-secondary-container":"#684000","surface-tint":"#006a63","primary-fixed-dim":"#80d5cb","on-surface":"#131b2e","surface-container-highest":"#dae2fd","tertiary-fixed-dim":"#ffb598","error":"#ba1a1a","surface-container-lowest":"#ffffff","surface-bright":"#faf8ff","on-error":"#ffffff","on-tertiary-fixed-variant":"#72361b","on-primary-fixed":"#00201d","surface-container-high":"#e2e7ff","on-tertiary-fixed":"#370e00","on-secondary-fixed-variant":"#653e00","primary":"#005c55","primary-fixed":"#9cf2e8","on-error-container":"#93000a","on-primary":"#ffffff","on-secondary":"#ffffff","on-primary-container":"#a3faef","surface":"#faf8ff","tertiary-fixed":"#ffdbce","background":"#faf8ff","inverse-surface":"#283044","surface-container-low":"#f2f3ff","on-surface-variant":"#3e4947","secondary-container":"#fea619","on-background":"#131b2e","secondary":"#855300","secondary-fixed":"#ffddb8","tertiary-container":"#9c573a","secondary-fixed-dim":"#ffb95f","surface-variant":"#dae2fd","outline-variant":"#bdc9c6","inverse-primary":"#80d5cb","outline":"#6e7977","surface-container":"#eaedff","primary-container":"#0f766e"},"borderRadius":{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},"spacing":{"margin-desktop":"2rem","gutter-desktop":"1.5rem","space-lg":"1.5rem","space-xl":"2rem","space-md":"1rem","space-xs":"0.25rem","gutter":"1rem","space-sm":"0.5rem","margin":"1rem"},"fontFamily":{"headline-lg":["Inter"],"headline-md":["Inter"],"headline-lg-mobile":["Inter"],"headline-xl":["Inter"],"price-display":["Inter"],"label-lg":["Inter"],"label-md":["Inter"],"headline-xl-mobile":["Inter"],"body-md":["Inter"],"body-lg":["Inter"],"body-sm":["Inter"],"label-sm":["Inter"]},"fontSize":{"headline-lg":["24px",{"lineHeight":"32px","letterSpacing":"-0.01em","fontWeight":"600"}],"headline-md":["18px",{"lineHeight":"24px","letterSpacing":"0em","fontWeight":"600"}],"headline-lg-mobile":["20px",{"lineHeight":"28px","letterSpacing":"-0.01em","fontWeight":"600"}],"headline-xl":["32px",{"lineHeight":"40px","letterSpacing":"-0.02em","fontWeight":"700"}],"price-display":["20px",{"lineHeight":"26px","letterSpacing":"-0.01em","fontWeight":"700"}],"label-lg":["16px",{"lineHeight":"24px","letterSpacing":"0.01em","fontWeight":"600"}],"label-md":["14px",{"lineHeight":"20px","letterSpacing":"0.01em","fontWeight":"500"}],"headline-xl-mobile":["26px",{"lineHeight":"34px","letterSpacing":"-0.015em","fontWeight":"700"}],"body-md":["14px",{"lineHeight":"20px","letterSpacing":"0em","fontWeight":"400"}],"body-lg":["16px",{"lineHeight":"24px","letterSpacing":"0em","fontWeight":"400"}],"body-sm":["12px",{"lineHeight":"16px","letterSpacing":"0.01em","fontWeight":"400"}],"label-sm":["11px",{"lineHeight":"14px","letterSpacing":"0.04em","fontWeight":"600"}]}}}}</script></head><body class="bg-surface font-body-md text-on-surface antialiased"><aside class="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col justify-between py-6 px-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div class="flex flex-col gap-6"><div class="px-3 flex flex-col gap-1"><div class="flex items-center gap-2"><div class="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm"><span class="material-symbols-outlined text-[22px]">storefront</span></div><span class="font-headline-md text-headline-md text-on-surface tracking-tight">ServiceFlow SA</span></div><div class="flex items-center gap-2 pl-1"><span class="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm uppercase tracking-wider">Provider Portal</span><span class="inline-flex items-center px-1.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">Partner</span></div></div><nav class="flex flex-col gap-1" data-active-classes="bg-primary-container text-on-primary font-semibold shadow-sm"><a aria-current="page" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 bg-primary-container text-on-primary font-semibold shadow-sm" data-path="bookings" href="#"><span class="material-symbols-outlined text-[20px]">calendar_month</span><span>Bookings</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-150" data-path="services" href="#"><span class="material-symbols-outlined text-[20px]">content_cut</span><span>Services</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-150" data-path="availability" href="#"><span class="material-symbols-outlined text-[20px]">schedule</span><span>Availability</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-150" data-path="clients" href="#"><span class="material-symbols-outlined text-[20px]">group</span><span>Clients</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-150" data-path="earnings" href="#"><span class="material-symbols-outlined text-[20px]">payments</span><span>Earnings</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-150" data-path="profile-settings" href="#"><span class="material-symbols-outlined text-[20px]">settings</span><span>Profile & Settings</span></a></nav></div><div class="flex flex-col gap-3 px-2 pt-4 bg-surface-container-lowest rounded-xl p-3 shadow-[0_1px_3px_0_rgba(15,23,42,0.05)]"><div class="flex items-center gap-3"><div class="relative flex-shrink-0"><div class="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-on-primary font-headline-md text-headline-md">SN</div><span class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-on-primary ring-2 ring-surface-container-lowest"><span class="material-symbols-outlined text-[10px]">verified</span></span></div><div class="flex flex-col min-w-0 flex-1"><span class="font-label-md text-label-md text-on-surface truncate">Sipho Ndlovu</span><span class="font-body-sm text-body-sm text-on-surface-variant truncate">Sipho's Cuts & Fades</span></div></div><div class="flex items-center justify-between pt-2 border-t border-surface-container"><div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span><span class="font-label-sm text-label-sm text-on-surface font-medium">Accepting Bookings</span></div><label class="relative inline-flex items-center cursor-pointer"><input checked="" class="sr-only peer" type="checkbox"/><div class="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div></label></div></div></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-gutter-desktop"><div class="flex items-center gap-3 flex-1 max-w-md"><div class="relative w-full flex items-center"><span class="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px]">search</span><input class="w-full pl-9 pr-4 py-2 bg-surface-container-lowest rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary shadow-[0_1px_2px_rgba(0,0,0,0.03)]" placeholder="Search clients, bookings, ref #..." type="text"/></div></div><div class="flex items-center gap-4"><div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm"><span class="material-symbols-outlined text-[16px] text-secondary">schedule</span><span>14:45 SAST</span><span class="text-outline-variant">|</span><span>Johannesburg</span></div><button class="relative p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-[22px]">chat</span><span class="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-secondary-container ring-2 ring-surface"></span></button><button class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-container-highest transition-colors" type="button"><span class="material-symbols-outlined text-[18px] text-primary">support_agent</span><span class="hidden md:inline">Concierge</span></button><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></header><main class="relative w-full pt-16 bg-surface px-gutter-desktop min-h-screen"><div class="flex flex-col w-full pb-16">
<!-- Top Greeting & Context Bar -->
<section class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-6">
<div class="flex flex-col gap-2 min-w-0">
<div class="flex flex-wrap items-center gap-3">
<h1 class="font-headline-xl text-headline-xl text-on-surface tracking-tight">Sawubona / Welcome back, Sipho! 👋</h1>
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm shadow-sm">
<span class="material-symbols-outlined text-[15px] text-secondary">event_available</span>
          Today: Friday, 25 October 2024 (SAST)
        </span>
</div>
<p class="font-body-md text-body-md text-on-surface-variant max-w-3xl">
        You have <span class="font-label-md text-label-md text-secondary font-semibold">3 incoming booking requests</span> requiring prompt confirmation. Automated WhatsApp client dispatch is active.
      </p>
</div>
<!-- Quick Action & Store State -->
<div class="flex items-center gap-3 flex-shrink-0">
<button class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest text-primary shadow-sm hover:bg-surface-container-low transition-all duration-150 font-label-md text-label-md" onclick="openManualBookingModal()" type="button">
<span class="material-symbols-outlined text-[20px]">add_circle</span>
<span>+ Add Manual Walk-in / Phone</span>
</button>
<div class="h-9 w-px bg-surface-container-highest hidden sm:block"></div>
<div class="hidden sm:flex items-center gap-2 bg-primary-fixed/40 px-3.5 py-2 rounded-xl text-on-primary-fixed-variant font-label-sm text-label-sm">
<span class="relative flex h-2.5 w-2.5">
<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
<span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
</span>
<span class="font-semibold tracking-wide">STUDIO LIVE • OXFORD PARKS</span>
</div>
</div>
</section>
<!-- Top Row Cards (Public Booking Link + Stat Metric Cluster) -->
<section class="grid grid-cols-1 xl:grid-cols-12 gap-5 mb-8">
<!-- Card 1: Shareable Booking Link (Spans 5 cols) -->
<div class="xl:col-span-5 bg-gradient-to-br from-surface-container-lowest via-surface-container-lowest to-surface-container-low p-6 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
<div class="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-primary/5 blur-2xl pointer-events-none"></div>
<div class="flex flex-col gap-3 relative z-10">
<div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="w-8 h-8 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
<span class="material-symbols-outlined text-[18px]">link</span>
</span>
<span class="font-label-lg text-label-lg text-on-surface">Your Public Booking Link</span>
</div>
<span class="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">Instant Sync</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          Share on WhatsApp status, Instagram bio or Facebook to let clients book directly without phone ping-pong.
        </p>
</div>
<div class="mt-4 flex flex-col gap-3 relative z-10">
<div class="flex items-center bg-surface-container rounded-xl p-1.5 pl-3.5 gap-2">
<span class="material-symbols-outlined text-outline text-[18px] flex-shrink-0">globe</span>
<input class="bg-transparent font-body-sm text-body-sm text-on-surface font-medium w-full focus:outline-none select-all truncate" id="publicBookingUrl" readonly="" type="text" value="serviceflow.co.za/pro/sipho-cuts"/>
<button class="flex items-center gap-1.5 bg-primary text-on-primary hover:bg-primary-container px-3.5 py-2 rounded-lg font-label-sm text-label-sm transition-colors flex-shrink-0 shadow-sm" id="copyBtn" onclick="copyPublicUrl()" type="button">
<span class="material-symbols-outlined text-[16px]" id="copyIcon">content_copy</span>
<span id="copyText">Copy Link</span>
</button>
<a class="p-2 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] transition-colors flex-shrink-0" href="https://wa.me/?text=Sawubona!%20Book%20your%20next%20fade%20or%20grooming%20session%20with%20Sipho%20online:%20https://serviceflow.co.za/pro/sipho-cuts" rel="noopener noreferrer" target="_blank" title="Share directly on WhatsApp">
<span class="material-symbols-outlined text-[18px]">send</span>
</a>
</div>
<div class="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm pt-1">
<span class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-[16px] text-primary">visibility</span>
<strong class="font-label-sm text-label-sm text-on-surface">34 views</strong> today
          </span>
<span class="text-outline-variant">•</span>
<span class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-[16px] text-secondary">trending_up</span>
<strong class="font-label-sm text-label-sm text-on-surface">82% conversion</strong> rate
          </span>
</div>
</div>
</div>
<!-- Stat Cards (Spans 7 cols: 3 cards) -->
<div class="xl:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-4">
<!-- Metric A: Pending Requests -->
<div class="bg-surface-container-lowest p-5 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
<div class="flex items-start justify-between">
<span class="font-label-md text-label-md text-on-surface-variant">Pending Requests</span>
<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm">
<span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            Action req.
          </span>
</div>
<div class="my-3">
<div class="flex items-baseline gap-2">
<span class="font-headline-xl text-headline-xl text-secondary">3</span>
<span class="font-label-sm text-label-sm text-secondary-container bg-surface-container-highest px-1.5 py-0.5 rounded">< 30m target</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">R680 potential revenue</p>
</div>
<div class="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
<div class="h-full bg-secondary rounded-full" style="width: 75%;"></div>
</div>
</div>
<!-- Metric B: Today's Bookings -->
<div class="bg-surface-container-lowest p-5 rounded-2xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
<div class="flex items-start justify-between">
<span class="font-label-md text-label-md text-on-surface-variant">Today's Bookings</span>
<span class="w-7 h-7 rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
<span class="material-symbols-outlined text-[16px]">event_seat</span>
</span>
</div>
<div class="my-3">
<div class="flex items-baseline gap-2">
<span class="font-headline-xl text-headline-xl text-on-surface">7</span>
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium">scheduled</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">5 completed • 2 remaining</p>
</div>
<div class="h-1.5 w-full bg-surface-container rounded-full overflow-hidden flex">
<div class="h-full bg-primary" style="width: 71%;"></div>
<div class="h-full bg-primary-fixed-dim" style="width: 29%;"></div>
</div>
</div>
<!-- Metric C: This Week's Revenue -->
<div class="bg-surface-container-lowest p-5 rounded-2xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
<div class="flex items-start justify-between">
<span class="font-label-md text-label-md text-on-surface-variant">This Week</span>
<span class="inline-flex items-center text-primary font-label-sm text-label-sm font-semibold bg-primary-fixed/40 px-2 py-0.5 rounded-full">
            +18%
          </span>
</div>
<div class="my-3">
<div class="flex items-baseline gap-1">
<span class="font-price-display text-price-display text-primary">R 7,420</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">32 total appointments</p>
</div>
<div class="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
<span class="material-symbols-outlined text-[14px] text-primary">check_circle</span>
<span>Payout ready Mon 08:00</span>
</div>
</div>
</div>
</section>
<!-- Main Appointments / Requests Section -->
<section class="bg-surface-container-lowest rounded-2xl shadow-sm p-6 mb-8 flex flex-col gap-6">
<!-- Filter Tabs & Controls Header -->
<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 bg-surface-container-lowest">
<!-- Tabs -->
<div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none" id="statusTabs">
<button class="tab-btn flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md shadow-sm transition-all whitespace-nowrap" onclick="switchFilterTab('action', this)" type="button">
<span>Action Required</span>
<span class="px-1.5 py-0.2 rounded-full bg-on-primary text-primary font-label-sm text-label-sm font-bold">3</span>
</button>
<button class="tab-btn flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all whitespace-nowrap" onclick="switchFilterTab('today', this)" type="button">
<span>Confirmed Today</span>
<span class="px-1.5 py-0.2 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">7</span>
</button>
<button class="tab-btn flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all whitespace-nowrap" onclick="switchFilterTab('week', this)" type="button">
<span>Upcoming This Week</span>
<span class="px-1.5 py-0.2 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">24</span>
</button>
<button class="tab-btn flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all whitespace-nowrap" onclick="switchFilterTab('past', this)" type="button">
<span>Past / Completed</span>
</button>
</div>
<!-- Search & Service Filter Input Box -->
<div class="flex items-center gap-3">
<div class="relative w-full sm:w-64">
<span class="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">search</span>
<input class="w-full pl-9 pr-3 py-2 bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" id="appointmentSearch" oninput="handleClientSearch()" placeholder="Search client or cell..." type="text"/>
</div>
<select class="px-3 py-2 bg-surface-container-low rounded-xl font-label-sm text-label-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm cursor-pointer">
<option>All Services</option>
<option>Signature Skin Fade</option>
<option>Afro Taper Fade</option>
<option>Executive Grooming</option>
<option>Beard & Hot Towel</option>
</select>
</div>
</div>
<!-- Live Bookings Stack -->
<div class="flex flex-col gap-4" id="bookingCardsContainer">
<!-- REQUEST 1 (Urgent pending with timer) -->
<article class="booking-card bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col xl:flex-row xl:items-center justify-between gap-5 relative overflow-hidden" data-client="Lerato Sithole" data-phone="+27 82 123 4567" data-status="pending">
<div class="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary"></div>
<!-- Left Details -->
<div class="flex items-start gap-4 min-w-0 flex-1 pl-2">
<div class="relative flex-shrink-0">
<div class="w-13 h-13 w-12 h-12 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-headline-md text-headline-md font-bold">
              LS
            </div>
<span class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-on-primary ring-2 ring-surface-container-lowest" title="Verified Mobile">
<span class="material-symbols-outlined text-[10px]">check</span>
</span>
</div>
<div class="flex flex-col gap-1.5 min-w-0 flex-1">
<div class="flex flex-wrap items-center gap-2">
<span class="font-headline-md text-headline-md text-on-surface font-semibold truncate">Lerato Sithole</span>
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">
<span class="material-symbols-outlined text-[14px]">hourglass_top</span>
                Pending Confirmation
              </span>
<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm animate-pulse">
<span class="material-symbols-outlined text-[12px]">timer</span>
                Expires in 18 mins
              </span>
</div>
<div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-on-surface-variant font-body-sm text-body-sm">
<span class="font-medium text-on-surface flex items-center gap-1">
<span class="material-symbols-outlined text-[16px] text-primary">content_cut</span>
                Signature Skin Fade & Hot Towel Beard Trim
              </span>
<span class="text-outline-variant">•</span>
<span class="flex items-center gap-1">
<span class="material-symbols-outlined text-[16px] text-outline">schedule</span>
                45 mins
              </span>
<span class="text-outline-variant">•</span>
<span class="flex items-center gap-1 font-semibold text-secondary">
<span class="material-symbols-outlined text-[16px]">alarm</span>
                Today, 09:45 AM SAST (In 25 mins)
              </span>
</div>
<div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-on-surface-variant font-body-sm text-body-sm pt-0.5">
<span class="flex items-center gap-1">
<span class="material-symbols-outlined text-[15px] text-outline">storefront</span>
                In-Studio • Oxford Parks Plaza, Shop 4
              </span>
<span class="text-outline-variant">•</span>
<span class="flex items-center gap-1 text-outline">
<span class="material-symbols-outlined text-[15px]">phone</span>
                +27 82 123 4567
              </span>
</div>
<!-- Client Note callout -->
<div class="mt-1 flex items-start gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg max-w-xl">
<span class="material-symbols-outlined text-secondary text-[16px] flex-shrink-0 mt-0.5">sticky_note_2</span>
<p class="font-body-sm text-body-sm text-on-surface"><span class="font-semibold text-on-surface-variant">Client note:</span> "Sensitive skin, low skin taper fade preferred"</p>
</div>
</div>
</div>
<!-- Right Price & Immediate Action Controls -->
<div class="flex flex-col sm:flex-row xl:flex-col items-start sm:items-center xl:items-end justify-between gap-3 flex-shrink-0 pl-14 xl:pl-0">
<div class="flex flex-col sm:items-end">
<span class="font-price-display text-price-display text-on-surface">R 220.00</span>
<span class="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
<span class="material-symbols-outlined text-[13px] text-outline">point_of_sale</span>
              Payment on arrival (Ozow / Card)
            </span>
</div>
<div class="flex items-center gap-2 w-full sm:w-auto">
<a class="p-2.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] transition-colors flex items-center justify-center" href="https://wa.me/27821234567?text=Sawubona%20Lerato,%20this%20is%20Sipho%20from%20Sipho%27s%20Cuts%20regarding%20your%20booking%20at%2009:45" rel="noopener noreferrer" target="_blank" title="Chat on WhatsApp">
<span class="material-symbols-outlined text-[20px]">chat</span>
</a>
<button class="px-3.5 py-2.5 rounded-xl bg-surface-container-high text-error hover:bg-error-container hover:text-on-error-container font-label-md text-label-md transition-colors" onclick="openDeclineModal('Lerato Sithole', 'R 220.00')" type="button">
              Decline
            </button>
<button class="px-4 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md shadow-sm transition-all flex items-center gap-1.5" onclick="confirmAppointment(this, 'Lerato Sithole')" type="button">
<span class="material-symbols-outlined text-[18px]">done_all</span>
<span>Confirm Booking</span>
</button>
</div>
</div>
</article>
<!-- REQUEST 2 (Pending) -->
<article class="booking-card bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col xl:flex-row xl:items-center justify-between gap-5 relative overflow-hidden" data-client="Kagiso Mokoena" data-phone="+27 83 987 6543" data-status="pending">
<div class="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary"></div>
<div class="flex items-start gap-4 min-w-0 flex-1 pl-2">
<div class="relative flex-shrink-0">
<div class="w-12 h-12 rounded-full bg-surface-container-high text-secondary flex items-center justify-center font-headline-md text-headline-md font-bold">
              KM
            </div>
<span class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-on-primary ring-2 ring-surface-container-lowest">
<span class="material-symbols-outlined text-[10px]">check</span>
</span>
</div>
<div class="flex flex-col gap-1.5 min-w-0 flex-1">
<div class="flex flex-wrap items-center gap-2">
<span class="font-headline-md text-headline-md text-on-surface font-semibold truncate">Kagiso Mokoena</span>
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">
<span class="material-symbols-outlined text-[14px]">hourglass_top</span>
                Pending Confirmation
              </span>
<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
<span class="material-symbols-outlined text-[12px]">schedule</span>
                Expires in 42 mins
              </span>
</div>
<div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-on-surface-variant font-body-sm text-body-sm">
<span class="font-medium text-on-surface flex items-center gap-1">
<span class="material-symbols-outlined text-[16px] text-primary">content_cut</span>
                Afro Taper Fade & Razor Line
              </span>
<span class="text-outline-variant">•</span>
<span class="flex items-center gap-1">
<span class="material-symbols-outlined text-[16px] text-outline">schedule</span>
                40 mins
              </span>
<span class="text-outline-variant">•</span>
<span class="flex items-center gap-1 font-semibold text-on-surface">
<span class="material-symbols-outlined text-[16px] text-outline">calendar_today</span>
                Today, 11:30 AM SAST
              </span>
</div>
<div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-on-surface-variant font-body-sm text-body-sm pt-0.5">
<span class="flex items-center gap-1 text-outline">
<span class="material-symbols-outlined text-[15px]">phone</span>
                +27 83 987 6543
              </span>
<span class="text-outline-variant">•</span>
<span class="inline-flex items-center gap-1 text-primary font-medium">
<span class="material-symbols-outlined text-[15px]">verified_user</span>
                Prepaid via Instant EFT
              </span>
</div>
<div class="mt-1 flex items-start gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg max-w-xl">
<span class="material-symbols-outlined text-secondary text-[16px] flex-shrink-0 mt-0.5">sticky_note_2</span>
<p class="font-body-sm text-body-sm text-on-surface"><span class="font-semibold text-on-surface-variant">Client note:</span> "First time client, coming from Sandton"</p>
</div>
</div>
</div>
<div class="flex flex-col sm:flex-row xl:flex-col items-start sm:items-center xl:items-end justify-between gap-3 flex-shrink-0 pl-14 xl:pl-0">
<div class="flex flex-col sm:items-end">
<span class="font-price-display text-price-display text-on-surface">R 190.00</span>
<span class="font-label-sm text-label-sm text-primary flex items-center gap-1">
<span class="material-symbols-outlined text-[13px]">lock</span>
              Paid via Instant EFT
            </span>
</div>
<div class="flex items-center gap-2 w-full sm:w-auto">
<a class="p-2.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] transition-colors flex items-center justify-center" href="https://wa.me/27839876543?text=Sawubona%20Kagiso,%20Sipho%20here%20from%20Sipho%27s%20Cuts" rel="noopener noreferrer" target="_blank">
<span class="material-symbols-outlined text-[20px]">chat</span>
</a>
<button class="px-3.5 py-2.5 rounded-xl bg-surface-container-high text-error hover:bg-error-container hover:text-on-error-container font-label-md text-label-md transition-colors" onclick="openDeclineModal('Kagiso Mokoena', 'R 190.00')" type="button">
              Decline
            </button>
<button class="px-4 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md shadow-sm transition-all flex items-center gap-1.5" onclick="confirmAppointment(this, 'Kagiso Mokoena')" type="button">
<span class="material-symbols-outlined text-[18px]">done_all</span>
<span>Confirm Booking</span>
</button>
</div>
</div>
</article>
<!-- REQUEST 3 (Pending Tomorrow) -->
<article class="booking-card bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col xl:flex-row xl:items-center justify-between gap-5 relative overflow-hidden" data-client="Thabo Molefe" data-phone="+27 71 555 4321" data-status="pending">
<div class="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary"></div>
<div class="flex items-start gap-4 min-w-0 flex-1 pl-2">
<div class="relative flex-shrink-0">
<div class="w-12 h-12 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-headline-md text-headline-md font-bold">
              TM
            </div>
<span class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-on-primary ring-2 ring-surface-container-lowest">
<span class="material-symbols-outlined text-[10px]">check</span>
</span>
</div>
<div class="flex flex-col gap-1.5 min-w-0 flex-1">
<div class="flex flex-wrap items-center gap-2">
<span class="font-headline-md text-headline-md text-on-surface font-semibold truncate">Thabo Molefe</span>
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">
<span class="material-symbols-outlined text-[14px]">hourglass_top</span>
                Pending Confirmation
              </span>
<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                Tomorrow's Slot
              </span>
</div>
<div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-on-surface-variant font-body-sm text-body-sm">
<span class="font-medium text-on-surface flex items-center gap-1">
<span class="material-symbols-outlined text-[16px] text-primary">face_3</span>
                Full Executive Grooming & Charcoal Facial
              </span>
<span class="text-outline-variant">•</span>
<span class="flex items-center gap-1">
<span class="material-symbols-outlined text-[16px] text-outline">schedule</span>
                60 mins
              </span>
<span class="text-outline-variant">•</span>
<span class="flex items-center gap-1 font-semibold text-on-surface">
<span class="material-symbols-outlined text-[16px] text-outline">calendar_today</span>
                Sat 26 Oct • 10:00 AM SAST
              </span>
</div>
<div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-on-surface-variant font-body-sm text-body-sm pt-0.5">
<span class="flex items-center gap-1 text-outline">
<span class="material-symbols-outlined text-[15px]">phone</span>
                +27 71 555 4321
              </span>
<span class="text-outline-variant">•</span>
<span class="inline-flex items-center gap-1 text-on-surface-variant font-medium">
<span class="material-symbols-outlined text-[15px] text-primary">account_balance_wallet</span>
                Deposit R100 paid via Capitec Pay (R170 balance due)
              </span>
</div>
</div>
</div>
<div class="flex flex-col sm:flex-row xl:flex-col items-start sm:items-center xl:items-end justify-between gap-3 flex-shrink-0 pl-14 xl:pl-0">
<div class="flex flex-col sm:items-end">
<span class="font-price-display text-price-display text-on-surface">R 270.00</span>
<span class="font-label-sm text-label-sm text-primary font-medium">R100 Deposit Secured</span>
</div>
<div class="flex items-center gap-2 w-full sm:w-auto">
<button class="px-3.5 py-2.5 rounded-xl bg-surface-container-high text-error hover:bg-error-container hover:text-on-error-container font-label-md text-label-md transition-colors" onclick="openDeclineModal('Thabo Molefe', 'R 270.00')" type="button">
              Decline
            </button>
<button class="px-4 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md shadow-sm transition-all flex items-center gap-1.5" onclick="confirmAppointment(this, 'Thabo Molefe')" type="button">
<span class="material-symbols-outlined text-[18px]">done_all</span>
<span>Confirm Booking</span>
</button>
</div>
</div>
</article>
<!-- REQUEST 4 (Example Confirmed for Context & Contrast) -->
<article class="booking-card bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col xl:flex-row xl:items-center justify-between gap-5 relative overflow-hidden" data-client="Dylan van der Merwe" data-phone="+27 84 321 7890" data-status="confirmed">
<div class="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
<div class="flex items-start gap-4 min-w-0 flex-1 pl-2">
<div class="relative flex-shrink-0">
<div class="w-12 h-12 rounded-full bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center font-headline-md text-headline-md font-bold">
              DV
            </div>
<span class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-on-primary ring-2 ring-surface-container-lowest">
<span class="material-symbols-outlined text-[10px]">done</span>
</span>
</div>
<div class="flex flex-col gap-1.5 min-w-0 flex-1">
<div class="flex flex-wrap items-center gap-2">
<span class="font-headline-md text-headline-md text-on-surface font-semibold truncate">Dylan van der Merwe</span>
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold">
<span class="material-symbols-outlined text-[14px]">check_circle</span>
                Confirmed • Checked In
              </span>
<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
                Regular Client (6 visits)
              </span>
</div>
<div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-on-surface-variant font-body-sm text-body-sm">
<span class="font-medium text-on-surface flex items-center gap-1">
<span class="material-symbols-outlined text-[16px] text-primary">content_cut</span>
                Classic Scissor Cut & Shape Up
              </span>
<span class="text-outline-variant">•</span>
<span class="flex items-center gap-1">
<span class="material-symbols-outlined text-[16px] text-outline">schedule</span>
                35 mins
              </span>
<span class="text-outline-variant">•</span>
<span class="flex items-center gap-1 font-semibold text-primary">
<span class="material-symbols-outlined text-[16px]">schedule</span>
                Today, 09:00 AM SAST
              </span>
</div>
<div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-on-surface-variant font-body-sm text-body-sm pt-0.5">
<span class="flex items-center gap-1 text-outline">
<span class="material-symbols-outlined text-[15px]">phone</span>
                +27 84 321 7890
              </span>
<span class="text-outline-variant">•</span>
<span class="inline-flex items-center gap-1 text-on-surface-variant">
<span class="material-symbols-outlined text-[15px] text-primary">receipt_long</span>
                Receipt #SF-74291-CPT
              </span>
</div>
</div>
</div>
<div class="flex flex-col sm:flex-row xl:flex-col items-start sm:items-center xl:items-end justify-between gap-3 flex-shrink-0 pl-14 xl:pl-0">
<div class="flex flex-col sm:items-end">
<span class="font-price-display text-price-display text-on-surface">R 180.00</span>
<span class="font-label-sm text-label-sm text-primary font-semibold flex items-center gap-1">
<span class="material-symbols-outlined text-[13px]">paid</span>
              Settled (Yoco Tap)
            </span>
</div>
<div class="flex items-center gap-2 w-full sm:w-auto">
<button class="px-3.5 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-container-highest transition-colors flex items-center gap-1.5" onclick="showReceiptModal('Dylan van der Merwe', 'R 180.00')" type="button">
<span class="material-symbols-outlined text-[16px]">receipt</span>
<span>Ticket / Receipt</span>
</button>
<button class="px-4 py-2.5 rounded-xl bg-surface-container-low text-primary hover:bg-surface-container font-label-md text-label-md transition-colors flex items-center gap-1.5" onclick="openRebookDialog('Dylan van der Merwe')" type="button">
<span class="material-symbols-outlined text-[16px]">replay</span>
<span>Rebook Client</span>
</button>
</div>
</div>
</article>
</div>
</section>
<!-- SA Localized Reassurance & Automation Banner -->
<section class="bg-gradient-to-r from-surface-container-lowest via-surface-container-low to-surface-container-lowest rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
<div class="flex items-center gap-3.5">
<div class="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#128C7E] flex items-center justify-center flex-shrink-0">
<span class="material-symbols-outlined text-[24px]">mark_chat_unread</span>
</div>
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="font-label-lg text-label-lg text-on-surface">Automated WhatsApp Reminders Active</span>
<span class="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold">Zero-Data Client Friendly</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">
          Reminders automatically dispatched 24h & 2h before appointments. Result: <strong class="text-on-surface font-semibold">0% no-show rate</strong> across Sipho's Cuts this week. POPIA & PAIA compliant records.
        </p>
</div>
</div>
<div class="flex items-center gap-2 flex-shrink-0">
<span class="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
<span class="material-symbols-outlined text-[16px] text-primary">security</span>
        POPIA Verified
      </span>
<button class="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface font-label-sm text-label-sm hover:bg-surface-container-highest transition-colors" onclick="alert('WhatsApp Bot is synced and actively delivering reminders.')" type="button">
        Configure Dispatch
      </button>
</div>
</section>
<!-- Confirmation Toast Notification (Hidden by default) -->
<div class="fixed bottom-6 right-6 z-50 transform translate-y-24 opacity-0 transition-all duration-300 pointer-events-none flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-5 py-3.5 rounded-2xl shadow-xl max-w-md" id="actionToast">
<span class="material-symbols-outlined text-primary-fixed text-[24px]" id="toastIcon">check_circle</span>
<div class="flex flex-col min-w-0">
<span class="font-label-md text-label-md font-semibold" id="toastTitle">Booking Confirmed</span>
<span class="font-body-sm text-body-sm opacity-90 truncate" id="toastMessage">Client notified via automated WhatsApp.</span>
</div>
</div>
<!-- Manual Booking Modal (Hidden by default) -->
<div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm hidden flex items-center justify-center p-4" id="manualBookingModal">
<div class="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-lg w-full p-6 flex flex-col gap-5">
<div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="w-8 h-8 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
<span class="material-symbols-outlined text-[20px]">add_task</span>
</span>
<h3 class="font-headline-md text-headline-md text-on-surface">Record Walk-in / Phone Booking</h3>
</div>
<button class="p-1 rounded-lg text-outline hover:bg-surface-container-high transition-colors" onclick="closeManualBookingModal()" type="button">
<span class="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<form class="flex flex-col gap-4" onsubmit="handleManualBookingSubmit(event)">
<div>
<label class="font-label-sm text-label-sm text-on-surface-variant block mb-1">Client Full Name *</label>
<input class="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" placeholder="e.g. Sindi Khumalo" required="" type="text"/>
</div>
<div>
<label class="font-label-sm text-label-sm text-on-surface-variant block mb-1">South African Mobile (for WhatsApp dispatch) *</label>
<input class="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" placeholder="082 123 4567" required="" type="tel"/>
</div>
<div class="grid grid-cols-2 gap-3">
<div>
<label class="font-label-sm text-label-sm text-on-surface-variant block mb-1">Service</label>
<select class="w-full px-3 py-2.5 rounded-xl bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm">
<option>Signature Skin Fade (R220)</option>
<option>Afro Taper Fade (R190)</option>
<option>Full Executive Grooming (R270)</option>
<option>Beard Sculpt & Shape (R140)</option>
</select>
</div>
<div>
<label class="font-label-sm text-label-sm text-on-surface-variant block mb-1">Time Slot Today</label>
<input class="w-full px-3 py-2 rounded-xl bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" type="time" value="14:00"/>
</div>
</div>
<div>
<label class="font-label-sm text-label-sm text-on-surface-variant block mb-1">Payment Method</label>
<div class="grid grid-cols-3 gap-2">
<label class="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low cursor-pointer font-body-sm text-body-sm text-on-surface">
<input checked="" class="text-primary focus:ring-primary" name="pay_type" type="radio"/>
<span>Cash</span>
</label>
<label class="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low cursor-pointer font-body-sm text-body-sm text-on-surface">
<input class="text-primary focus:ring-primary" name="pay_type" type="radio"/>
<span>Card / Tap</span>
</label>
<label class="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low cursor-pointer font-body-sm text-body-sm text-on-surface">
<input class="text-primary focus:ring-primary" name="pay_type" type="radio"/>
<span>Instant EFT</span>
</label>
</div>
</div>
<div class="flex items-center justify-end gap-3 pt-3">
<button class="px-4 py-2.5 rounded-xl bg-surface-container-high text-on-surface-variant font-label-md text-label-md" onclick="closeManualBookingModal()" type="button">
            Cancel
          </button>
<button class="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container shadow-sm" type="submit">
            Save & Dispatch WhatsApp
          </button>
</div>
</form>
</div>
</div>
<!-- Decline Reason Dialog Modal -->
<div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm hidden flex items-center justify-center p-4" id="declineModal">
<div class="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-md w-full p-6 flex flex-col gap-4">
<div class="flex items-center gap-3 text-error">
<span class="w-10 h-10 rounded-xl bg-error-container text-on-error-container flex items-center justify-center">
<span class="material-symbols-outlined text-[22px]">event_busy</span>
</span>
<div>
<h3 class="font-headline-md text-headline-md text-on-surface">Decline Booking</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant" id="declineClientName">Lerato Sithole</p>
</div>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">
        Select a reason so ServiceFlow SA can assist the client with rescheduling or automated slot re-routing:
      </p>
<div class="flex flex-col gap-2">
<label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container font-body-sm text-body-sm text-on-surface">
<input checked="" class="text-error focus:ring-error" name="decline_reason" type="radio"/>
<span>Fully booked at requested hour</span>
</label>
<label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container font-body-sm text-body-sm text-on-surface">
<input class="text-error focus:ring-error" name="decline_reason" type="radio"/>
<span>Barber on break / Load-shedding power downtime</span>
</label>
<label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container font-body-sm text-body-sm text-on-surface">
<input class="text-error focus:ring-error" name="decline_reason" type="radio"/>
<span>Requested service unavailable today</span>
</label>
</div>
<div class="flex items-center justify-end gap-2 pt-2">
<button class="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md" onclick="closeDeclineModal()" type="button">
          Keep Booking
        </button>
<button class="px-4 py-2 rounded-xl bg-error text-on-error font-label-md text-label-md hover:opacity-90" onclick="submitDeclineAction()" type="button">
          Decline & Notify
        </button>
</div>
</div>
</div>
</div>
<script>
  // Copy Public Booking Link
  function copyPublicUrl() {
    const input = document.getElementById('publicBookingUrl');
    input.select();
    input.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(input.value).then(() => {
      const copyText = document.getElementById('copyText');
      const copyIcon = document.getElementById('copyIcon');
      copyText.innerText = 'Copied!';
      copyIcon.innerText = 'check';
      showToast('Link Copied', 'Share your direct booking link anywhere.');
      setTimeout(() => {
        copyText.innerText = 'Copy Link';
        copyIcon.innerText = 'content_copy';
      }, 2500);
    });
  }

  // Toast Notification
  function showToast(title, msg) {
    const toast = document.getElementById('actionToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    toastTitle.innerText = title;
    toastMessage.innerText = msg;
    
    toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');
    
    setTimeout(() => {
      toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3200);
  }

  // Confirm booking interaction
  function confirmAppointment(button, clientName) {
    const card = button.closest('article');
    // Visual transformation
    button.disabled = true;
    button.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Confirming...';
    
    setTimeout(() => {
      // Morph card state to confirmed
      const leftAccent = card.querySelector('div.absolute.left-0');
      if (leftAccent) {
        leftAccent.classList.remove('bg-secondary');
        leftAccent.classList.add('bg-primary');
      }
      card.setAttribute('data-status', 'confirmed');
      
      const badgeContainer = card.querySelector('.gap-2');
      if (badgeContainer) {
        badgeContainer.innerHTML = `
          <span class="font-headline-md text-headline-md text-on-surface font-semibold truncate">${clientName}</span>
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold">
            <span class="material-symbols-outlined text-[14px]">check_circle</span>
            Confirmed • Ready for Client
          </span>
        `;
      }
      
      // Update action container
      const actionArea = button.parentElement;
      actionArea.innerHTML = `
        <button type="button" onclick="showReceiptModal('${clientName}', 'Settled via App')" class="px-3.5 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-container-highest transition-colors flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">receipt</span>
          <span>View Ticket</span>
        </button>
        <button type="button" class="px-4 py-2.5 rounded-xl bg-primary-fixed/50 text-on-primary-fixed-variant font-label-md text-label-md cursor-default flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">done</span>
          <span>Confirmed</span>
        </button>
      `;

      showToast('Booking Confirmed!', `${clientName} received calendar & WhatsApp confirmation.`);
    }, 600);
  }

  // Decline Modal Logic
  let activeDeclineCard = null;
  function openDeclineModal(clientName, amount) {
    activeDeclineCard = event.target.closest('article');
    document.getElementById('declineClientName').innerText = `${clientName} • ${amount}`;
    document.getElementById('declineModal').classList.remove('hidden');
  }

  function closeDeclineModal() {
    document.getElementById('declineModal').classList.add('hidden');
    activeDeclineCard = null;
  }

  function submitDeclineAction() {
    if (activeDeclineCard) {
      activeDeclineCard.style.transition = 'all 0.3s ease';
      activeDeclineCard.style.opacity = '0';
      activeDeclineCard.style.transform = 'scale(0.96)';
      setTimeout(() => {
        activeDeclineCard.remove();
        showToast('Request Declined', 'Slot freed and client notified with polite alternatives.');
      }, 300);
    }
    closeDeclineModal();
  }

  // Manual Booking Modal
  function openManualBookingModal() {
    document.getElementById('manualBookingModal').classList.remove('hidden');
  }

  function closeManualBookingModal() {
    document.getElementById('manualBookingModal').classList.add('hidden');
  }

  function handleManualBookingSubmit(e) {
    e.preventDefault();
    closeManualBookingModal();
    showToast('Walk-in Recorded', 'Slot reserved on calendar. Automated reminder queued.');
  }

  // Search Filter
  function handleClientSearch() {
    const query = document.getElementById('appointmentSearch').value.toLowerCase();
    const cards = document.querySelectorAll('.booking-card');
    cards.forEach(card => {
      const client = (card.getAttribute('data-client') || '').toLowerCase();
      const phone = (card.getAttribute('data-phone') || '').toLowerCase();
      if (client.includes(query) || phone.includes(query)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Filter Tabs
  function switchFilterTab(type, button) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm');
      btn.classList.add('bg-surface-container-low', 'text-on-surface-variant');
    });
    button.classList.add('bg-primary', 'text-on-primary', 'shadow-sm');
    button.classList.remove('bg-surface-container-low', 'text-on-surface-variant');

    const cards = document.querySelectorAll('.booking-card');
    cards.forEach(card => {
      const status = card.getAttribute('data-status');
      if (type === 'action') {
        card.style.display = status === 'pending' ? 'flex' : 'none';
      } else if (type === 'today') {
        card.style.display = 'flex';
      } else {
        card.style.display = 'flex';
      }
    });
  }

  function showReceiptModal(client, price) {
    showToast(`Receipt for ${client}`, `Transaction total ${price} recorded.`);
  }

  function openRebookDialog(client) {
    showToast('Rebooking Flow', `Pre-filling custom slot for returning client ${client}.`);
  }
</script></main></div></body></html>