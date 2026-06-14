// docMenu.js
// Navigation structure for the JustLive documentation site.
// Add new pages here — the sidebar and routing are driven by this array.

export const docMenu = [
  {
    category: "Category A: Getting Started",
    items: [
      { id: "intro",  title: "Introduction" },
      { id: "boot",   title: "Engine Boot Sequence" },
      { id: "vfs",    title: "VFS Scopes & Structure" }
    ]
  },
  {
    category: "Category B: Modding Foundations",
    items: [
      { id: "iostore",    title: "IOStore Packaging (.ucas/.utoc)" },
      { id: "manifest",   title: "Mod Manifests (content.xml)" },
      { id: "editorfree", title: "Editor vs. Editor-Free Mods" },
      { id: "tools",      title: "Recommended Modding Tools" }
    ]
  },
  {
    category: "Category C: Core Systems",
    items: [
      { id: "datamanager", title: "Central Data (DataManager)" },
      { id: "managers",    title: "Weather & Environment Managers" },
      { id: "media",       title: "Media Systems (Audio, VFX, Decals)" }
    ]
  },
  {
    category: "Category D: Combat & Animation Corner",
    items: [
      { id: "weapons",   title: "Weapons, Combat & Firing" },
      { id: "anims",     title: "Locomotion & Dynamic Anim Sets" },
      { id: "pedactor",  title: "Pedestrian Actor Monolith (APed)" }
    ]
  },
  {
    category: "Category E: Scripting VM & AI Tasks",
    items: [
      { id: "scriptvm",      title: "ScriptVM Pipeline & Bindings" },
      { id: "aischeduling",  title: "AI Task Scheduler & Watcher" }
    ]
  },
  {
    category: "Category F: XML Database Reference",
    items: [
      { id: "xml_peds",    title: "Peds & Factions DB (Peds.xml)" },
      { id: "xml_weapons", title: "Weapons & Ballistics DB" },
      { id: "xml_world",   title: "World Props & Interactions" },
      { id: "xml_media",   title: "VFX, Audio & Shaders DB" },
      { id: "xml_weather", title: "Weather & TimeCycles DB" },
      { id: "xml_core",    title: "Core Rules, Skills & Pools" }
    ]
  },
  {
    category: "Category G: Ped System Deep Dive",
    items: [
      { id: "ped_types",        title: "EPedType & Population Enums" },
      { id: "ped_capabilities", title: "Capability Flags (ECapability)" },
      { id: "ped_states",       title: "Movement States & Action States" },
      { id: "ped_ambient",      title: "AmbientPedPopulation System" },
      { id: "ped_history",      title: "HistoryTagChecker & PedFactory" }
    ]
  },
  {
    category: "Category H: VFS & Data Internals",
    items: [
      { id: "vfs_deep",           title: "VFSManager Deep Dive" },
      { id: "vfs_crypto",         title: "GXMLCrypto — AES-256 XML" },
      { id: "vfs_containers",     title: "Unreal Containers & Mounting" },
      { id: "vfs_weapons_struct", title: "FWeaponStaticInfo Struct Guide" }
    ]
  },
  {
    category: "Category I: Advanced Scripting Reference",
    items: [
      { id: "script_lifecycle", title: "ScriptManager Lifecycle" },
      { id: "script_fibers",    title: "Fiber Execution & Latency" },
      { id: "script_native",    title: "Native Binding & Auto-Binder" },
      { id: "script_library",   title: "Scripting Native Library API" },
      { id: "script_bytecode",  title: "Bytecode Distribution (.scc)" }
    ]
  },
  {
    category: "Category J: Vehicle & Physics Simulation",
    items: [
      { id: "vehicle_dynamics", title: "Chaos Vehicle Dynamics" },
      { id: "vehicle_damage",   title: "Deformation & Destruction" },
      { id: "vehicle_ambient",  title: "AmbientVehiclePopulation System" }
    ]
  },
  {
    category: "Category K: Economy, Progression & Save System",
    items: [
      { id: "economy_inventory", title: "Inventory & MillHaven Coin" },
      { id: "economy_market",    title: "Market & Prices Discovery" },
      { id: "progression_traits", title: "Identity & 29-Axis Traits" },
      { id: "progression_combat", title: "Combat Proficiencies" },
      { id: "save_architecture",  title: "Save & Persistence Architecture" }
    ]
  },
  {
    category: "Category L: Network, Replication & UI",
    items: [
      { id: "net_replication", title: "Replication & Event Cause Log" },
      { id: "net_eos",         title: "EOS Integration & Sessions" },
      { id: "ui_slate",         title: "Programmatic Slate HUD" }
    ]
  }
];


export function getCategorySlug(categoryTitle) {
  // Extract just the name part after the colon, e.g., "Category A: Getting Started" -> "Getting Started"
  const namePart = categoryTitle.split(': ')[1] || categoryTitle;
  return namePart.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

/** Returns the category label string for a given page id. */
export function getCategoryTitle(docId) {
  for (const cat of docMenu) {
    if (cat.items.some(item => item.id === docId)) return cat.category;
  }
  return docMenu[0].category;
}
