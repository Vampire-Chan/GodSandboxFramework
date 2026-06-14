// CatK_EconomyProgression.jsx
// Category K: Economy & Progression
import React from 'react';
import { WorkflowTabGroup, GodCodeBlock } from './docsHelpers';

export function renderPage(docId) {
  switch (docId) {

    case 'economy_inventory':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Economy &amp; Progression</span>
            <h1 className="doc-main-title">Inventory &amp; Currency Wallet</h1>
            <p className="doc-lead-para">
              The <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Peds/Components/InventoryComponent.h" style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 'bold' }}>UInventoryComponent</a> manages slots, weapon attachments, item weight constraints, pocket currency, and soft-reference async asset preloading.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="inventory-modes">Inventory Modes</h2>
            <p>
              JustLive supports two main inventory rules via the <code>EInventoryMode</code> enum:
            </p>
            <ul>
              <li><strong>Casual:</strong> No weight limits. Standard slot boundaries apply. Weapons and ammo are managed dynamically.</li>
              <li><strong>RPG:</strong> Rigid weight limits checked against <code>CurrentWeight</code> and <code>MaxWeight</code>. Adding items that exceed the limit returns false.</li>
            </ul>
          </section>

          <section className="doc-section">
            <h2 id="wallet-systems">Currency Wallet</h2>
            <p>
              Wealth is tracked locally via the <code>FCurrencyWallet</code> struct. Pockets contain cash divided into tiers, which drops on character death or robbery. ATM transactions route cash to bank balances on the <code>UPedProfileComponent</code>.
            </p>
          </section>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="economy-xml">Configuring Items (XML)</h2>
                  <p>Items and baseline prices are defined in <code>@data/Entities/Items.xml</code>:</p>
                  <GodCodeBlock
                    language="xml"
                    code={`<!-- Items.xml -->
<Items>
  <Item id="Item_Medkit" price="500" weight="1.5" stackLimit="5" />
  <Item id="Item_GoldBar" price="5000" weight="10.0" stackLimit="10" />
</Items>`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="economy-bp">Blueprint Inventory Setup</h2>
                  <p>
                    Visual designers can place the <code>InventoryComponent</code> on characters. Checkboxes and floats inside the details panels control:
                  </p>
                  <ul>
                    <li><strong>Inventory Mode:</strong> Choose Casual or RPG mode.</li>
                    <li><strong>Max Weight:</strong> Maximum carrying limit (float, in kilograms).</li>
                    <li><strong>Starting Cash:</strong> Set default pocket wallet amounts.</li>
                  </ul>
                  <p>
                    Developers drop weapons into the viewport and bind overlap events to call <code>AdoptWeaponInstance</code> or <code>AddItem</code>.
                  </p>
                </section>
              </>
            }
            cCodeContent={
              <>
                <section className="doc-section">
                  <h2 id="economy-cpp">Currency &amp; Async Streaming (C++)</h2>
                  <p>
                    To prevent frame hitches during weapon swaps, the component utilizes the engine's <code>FStreamableManager</code> to pre-cache visual meshes asynchronously:
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Give a weapon and preload its mesh assets asynchronously
void UInventoryComponent::GiveWeapon(FName WeaponID, int32 AmmoReserve, bool bEquipNow, bool bKeepOnDeath)
{
    // Register the slot weapon instance
    TSharedPtr<FWeaponInstance> NewWeapon = MakeShared<FWeaponInstance>(WeaponID);
    
    // Request async load
    PreloadWeaponAssets(WeaponID);
}`}
                  />
                  <p>
                    Pocket wallet adjustments utilize the standard transaction APIs:
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Add currency to pocket wallet
InventoryComp->AddCurrency(ECurrencyTier::Coin, 500);

// Deduct currency for vendor purchases
bool bPaid = InventoryComp->RemoveCurrency(ECurrencyTier::Coin, 120);`}
                  />
                  <p>
                    From scripts, pocket cash deposits can be triggered directly:
                  </p>
                  <GodCodeBlock
                    language="sc"
                    code={`// Script transaction
local ped = Peds->GetPlayerPed();
if (ped)
{
    Ped->DepositToBank(ped, 1, 1000); // Deposit 1000 Coins
}`}
                  />
                </section>
              </>
            }
          />
        </article>
      );

    case 'economy_market':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Economy &amp; Progression</span>
            <h1 className="doc-main-title">Market &amp; Prices Discovery</h1>
            <p className="doc-lead-para">
              JustLive uses dynamic vendor tables and local multiplier offsets to determine trade prices dynamically during transaction requests.
            </p>
          </header>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="market-xml">Market Vendor Configuration (XML)</h2>
                  <p>Region multipliers and starting stocks are declared in <code>@data/Economy/Markets.xml</code>:</p>
                  <GodCodeBlock
                    language="xml"
                    code={`<!-- Markets.xml -->
<Markets>
  <MarketVendor id="Vendor_Downtown_Armory">
    <TradeMultiplier sell="1.2" buy="0.8" />
    <StockItem id="Item_Ammo_Rifle" quantity="100" />
    <StockItem id="Item_Medkit" quantity="15" />
  </MarketVendor>
</Markets>`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="market-bp">Blueprint Vendor Interaction</h2>
                  <p>
                    Lobby and store UI screens trigger transaction checks against the vendor. Designers configure the vendor ID in the trigger details panel to direct pricing lookups.
                  </p>
                </section>
              </>
            }
            cCodeContent={
              <>
                <section className="doc-section">
                  <h2 id="market-sdk">Market Price Calculation (C++)</h2>
                  <p>
                    Vendors calculate prices dynamically by scaling base items against regional factors:
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Query price from the market subsystem
int32 UMarketSubsystem::CalculatePrice(FName ItemID, FName VendorID, bool bIsBuying)
{
    const FItemStaticInfo* BaseItem = DataManager->GetItemInfo(ItemID);
    const FVendorStaticInfo* Vendor = DataManager->GetVendorInfo(VendorID);
    
    if (BaseItem && Vendor)
    {
        float Multiplier = bIsBuying ? Vendor->BuyMultiplier : Vendor->SellMultiplier;
        return FMath::RoundToInt(BaseItem->BasePrice * Multiplier);
    }
    return 0;
}`}
                  />
                </section>
              </>
            }
          />
        </article>
      );

    case 'progression_traits':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Economy &amp; Progression</span>
            <h1 className="doc-main-title">Identity &amp; 29-Axis Traits</h1>
            <p className="doc-lead-para">
              Character personalities and history markers are driven by the <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Peds/Components/IdentityComponent.h" style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 'bold' }}>UIdentityComponent</a>, feeding trait states straight into decision-making.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="traits-list">The 29 Personality Traits</h2>
            <p>
              JustLive uses 29 float axes (0–100, neutral midpoint at 50) to model characters. Example traits include:
            </p>
            <ul>
              <li><strong>Integrity:</strong> Higher values prevent criminal acts. Depleted by robbery or theft.</li>
              <li><strong>Courage:</strong> Dictates cover mechanics and combat retreat triggers.</li>
              <li><strong>Aggression:</strong> Promotes offensive combat tasks instead of fleeing.</li>
              <li><strong>Neurotism:</strong> Modulates vocal speech triggers under threat pressure.</li>
            </ul>
          </section>

          <section className="doc-section">
            <h2 id="decay-cooling">Inactivity Decay ("Cooling Off")</h2>
            <p>
              To prevent permanent extremes, traits drift back toward the neutral midpoint (50.0) after 30 real-world days of inactivity. Drift uses the stable exponential rate <code>TRAIT_DECAY_RATE_PER_SEC = 0.0000033f</code>. 
            </p>
            <p>
              To compute this while the player is offline, <code>ApplyOfflineDecay</code> runs at login:
            </p>
            <div className="flow-visual-box">
              <div className="flow-node"><span className="node-num">1</span><div className="node-info"><h5>Read Save</h5><p>Fetch last activity timestamp.</p></div></div>
              <div className="flow-arrow">→</div>
              <div className="flow-node"><span className="node-num">2</span><div className="node-info"><h5>Calc Duration</h5><p>Determine duration offline.</p></div></div>
              <div className="flow-arrow">→</div>
              <div className="flow-node"><span className="node-num">3</span><div className="node-info"><h5>Apply Drift</h5><p>Shift traits towards 50.0.</p></div></div>
            </div>
          </section>

          <section className="doc-section">
            <h2 id="learning-bridge">The Learning Bridge</h2>
            <p>
              The learning bridge links raw trait drift (0–100) to actual AI weight parameters (0.0–1.0) using <code>DerivePersonalityConfig()</code>. When a player runs many criminal activities, their Integrity drifts down and Aggression drifts up, altering their AI response loops.
            </p>
          </section>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="traits-xml">Setting Personalities (XML)</h2>
                  <p>Default archetype personalities are configured in <code>@data/Peds/Peds.xml</code>:</p>
                  <GodCodeBlock
                    language="xml"
                    code={`<!-- Peds.xml -->
<Personality id="Civ_Urban_Defensive">
  <Trait id="Courage" value="35.0" />
  <Trait id="Aggression" value="20.0" />
  <Trait id="Neurotism" value="65.0" />
</Personality>`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="traits-bp">Accessing Status Flags</h2>
                  <p>
                    Replicated identity flags can be checked in Blueprints to determine if character tags match (e.g., civilian, military, law enforcement, resident).
                  </p>
                </section>
              </>
            }
            cCodeContent={
              <>
                <section className="doc-section">
                  <h2 id="traits-cpp">Trait Drift &amp; History Log (C++)</h2>
                  <p>
                    Mutate traits and log append-only history entries in C++:
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Apply signed delta to trait axis
IdentityComp->ApplyTraitDrift(ETraitID::Aggression, +5.0f);

// Record permanent witnessable history tag
IdentityComp->AddHistoryTag(FName("Tag_BankHeist_Leader"), EHistoryTagCategory::Infamy, TEXT("Led heist at Main Bank"));`}
                  />
                  <p>
                    From scripts, query traits directly to adjust dialogue paths:
                  </p>
                  <GodCodeBlock
                    language="sc"
                    code={`// Check ped courage
local ped = Peds->GetPlayerPed();
local courage = Ped->GetTraitValue(ped, 2); // 2 = Courage ID
if (courage > 70.0)
{
    // Ped fights back
    Ped->SetTaskAttackPlayer(ped);
}`}
                  />
                </section>
              </>
            }
          />
        </article>
      );

    case 'progression_combat':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Economy &amp; Progression</span>
            <h1 className="doc-main-title">Combat &amp; Skill Trees</h1>
            <p className="doc-lead-para">
              The skill progression system uses the <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Peds/SkillManager.h" style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 'bold' }}>USkillManager</a> subsystem and <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Peds/Components/SkillComponent.h" style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 'bold' }}>USkillComponent</a> to drive reload speed buffers, accuracy modifiers, and unlockable abilities.
            </p>
          </header>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="combat-prog-xml">Skill Setup (XML)</h2>
                  <p>Skill prerequisites and point costs are defined in <code>@data/Skills.xml</code>:</p>
                  <GodCodeBlock
                    language="xml"
                    code={`<!-- Skills.xml -->
<Skills>
  <Skill id="Skill_Pistol_Mastery" category="Combat" cost="2" parent="Skill_Pistol_Basic">
    <Name>Pistol Mastery</Name>
    <Description>Reduces hand weapon reload times and improves sway.</Description>
  </Skill>
</Skills>`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="combat-prog-bp">Blueprint Skill Checks</h2>
                  <p>
                    Bind actions to the <code>OnSkillUnlocked</code> delegate inside character Blueprints. Use <code>IsSkillUnlocked</code> to gate visual HUD widgets or input paths.
                  </p>
                </section>
              </>
            }
            cCodeContent={
              <>
                <section className="doc-section">
                  <h2 id="combat-prog-sdk">Unlocking Skills (C++)</h2>
                  <p>
                    Award skill points and unlock branches via component API checks:
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Add points to pool
SkillComp->AddSkillPoints(1);

// Try unlock mastery skill
if (SkillComp->TryUnlockSkill(FName("Skill_Pistol_Mastery")))
{
    // Success, stats updated
}`}
                  />
                </section>
              </>
            }
          />
        </article>
      );

    case 'save_architecture':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Economy &amp; Progression</span>
            <h1 className="doc-main-title">Save &amp; Persistence Architecture</h1>
            <p className="doc-lead-para">
              JustLive uses structural serialization blocks to dump complete player and NPC status arrays into persistent save buffers.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="save-savegame-fields">Save Structure Hierarchy</h2>
            <p>
              Serialization relies on the master struct <code>FPlayerSaveData</code> defined in <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Core/Save/SaveDataTypes.h" style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 'bold' }}>SaveDataTypes.h</a>. It wraps sub-struct mirrors of all major ped components:
            </p>
            <ul>
              <li><strong>FAttributeSaveData:</strong> Persists Health, Armor, Stamina, Mana, and pocket cash values.</li>
              <li><strong>FIdentitySaveData:</strong> Persists the replicated status flags, the 29 raw trait floats, the complete witness history log, and active bounty rates. Includes <code>LastActivityTimestamp</code> to compute offline inactivity decay.</li>
              <li><strong>FInventorySaveData:</strong> Persists slotted weapons, clip rounds, ammo reserve logs, and items.</li>
              <li><strong>FProfessionSaveData:</strong> Persists active rank, reputation, and class.</li>
              <li><strong>FSocialSaveData:</strong> Persists relationships status flags and active social traits.</li>
            </ul>
          </section>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="save-xml">Save Slot Limits (XML)</h2>
                  <p>Auto-save frequency and slot caps are defined under <code>@data/Config/SaveSettings.xml</code>:</p>
                  <GodCodeBlock
                    language="xml"
                    code={`<!-- SaveSettings.xml -->
<SaveConfig autoSaveInterval="300" maxSlots="10" />`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="save-bp">Triggering Save/Load</h2>
                  <p>
                    Match progress nodes call save subsystem methods. HUD elements can trigger load screen states and fetch saved slots coordinates.
                  </p>
                </section>
              </>
            }
            cCodeContent={
              <>
                <section className="doc-section">
                  <h2 id="save-sdk">Serializing States (C++)</h2>
                  <p>
                    Components implement <code>ToSaveData</code> and <code>FromSaveData</code> to serialize fields cleanly:
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Convert IdentityComponent to save structure
void UIdentityComponent::ToSaveData(FIdentitySaveData& OutData) const
{
    OutData.IdentityFlags = Identity;
    OutData.TraitScores = TraitScores;
    OutData.Bounty = Bounty;
    OutData.LastActivityTimestamp = LastActivityTimestamp;
    
    // Copy history log arrays
    for (const FHistoryEntry& Entry : HistoryLog)
    {
        FHistorySaveData SaveEntry;
        SaveEntry.TagID = Entry.TagID;
        SaveEntry.Category = static_cast<uint8>(Entry.Category);
        SaveEntry.Timestamp = Entry.Timestamp;
        SaveEntry.Context = Entry.Context;
        SaveEntry.WitnessIDs = Entry.WitnessIDs;
        SaveEntry.ZoneID = Entry.ZoneID;
        SaveEntry.bExpungeable = Entry.bExpungeable;
        OutData.HistoryLog.Add(SaveEntry);
    }
}`}
                  />
                </section>
              </>
            }
          />
        </article>
      );

    default: return null;
  }
}

export function getOutline(docId) {
  switch (docId) {
    case 'economy_inventory':
      return (
        <>
          <li><a href="#inventory-modes">Inventory Modes</a></li>
          <li><a href="#wallet-systems">Currency Wallet</a></li>
          <li><a href="#economy-xml">Configuring Items (XML)</a></li>
        </>
      );
    case 'economy_market':
      return (
        <>
          <li><a href="#market-xml">Market Vendor Configuration (XML)</a></li>
          <li><a href="#market-sdk">Market Price Calculation</a></li>
        </>
      );
    case 'progression_traits':
      return (
        <>
          <li><a href="#traits-list">The 29 Personality Traits</a></li>
          <li><a href="#decay-cooling">Inactivity Decay</a></li>
          <li><a href="#learning-bridge">The Learning Bridge</a></li>
          <li><a href="#traits-xml">Setting Personalities (XML)</a></li>
          <li><a href="#traits-cpp">Trait Drift &amp; History Log (C++)</a></li>
        </>
      );
    case 'progression_combat':
      return (
        <>
          <li><a href="#combat-prog-xml">Skill Setup (XML)</a></li>
          <li><a href="#combat-prog-sdk">Unlocking Skills (C++)</a></li>
        </>
      );
    case 'save_architecture':
      return (
        <>
          <li><a href="#save-savegame-fields">Save Structure Hierarchy</a></li>
          <li><a href="#save-xml">Save Slot Limits (XML)</a></li>
          <li><a href="#save-sdk">Serializing States (C++)</a></li>
        </>
      );
    default: return null;
  }
}
