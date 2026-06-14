// CatE_ScriptingAI.jsx
// Category E: Scripting VM & AI Tasks
import React from 'react';
import { WorkflowTabGroup, GodCodeBlock } from './docsHelpers';

/**
 * Returns the rendered article JSX for the given docId,
 * or null if this category doesn't own that id.
 */
export function renderPage(docId) {
  switch (docId) {

    case 'aischeduling':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Scripting &amp; AI Tasks</span>
            <h1 className="doc-main-title">AI Task Scheduler &amp; Watcher</h1>
            <p className="doc-lead-para">
              JustLive handles ambient population and combat behavior using a prioritizing task scheduler. Peds execute multiple non-conflicting tasks simultaneously using slots and resource locks.
            </p>
          </header>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="aischeduling-slots">Concurrent Execution Slots</h2>
                  <p>
                    Peds utilize XML-driven personalities (<code>Data/Entities/Personality.xml</code>) to gate capabilities. The engine schedules three parallel slots (<code>ETaskSlot</code>) based on the personality flags. 
                  </p>
                </section>
                <section className="doc-section">
                  <h2 id="aischeduling-priorities">Priority Rings &amp; Interrupts</h2>
                  <p>
                    Tasks are assigned priority indices in XML behavior trees. Higher priority tasks defined in AI behavior XML will automatically suspend lower priority ambient behaviors.
                  </p>
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="aischeduling-slots-bp">Concurrent Execution Slots (SDK)</h2>
                  <p>
                    From C++ or Blueprints, you interact with the <code>UTaskWatcherComponent</code>. You push tasks directly into these slots by subclassing <code>UTaskSimpleBase</code> or <code>UTaskComplexBase</code>.
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Blueprint / C++: Push Task
TaskWatcher->PushTask(NewTask, ETaskSlot::Primary, ETaskPriority::High);`}
                  />
                </section>
                <section className="doc-section">
                  <h2 id="aischeduling-priorities-bp">Priority Rings (SDK)</h2>
                  <p>
                    Task suspension is handled automatically by the scheduler based on the priority value. To manually override a slot, you must use <code>TaskWatcher-&gt;ClearSlot(ETaskSlot::Primary)</code> before pushing the new, higher-priority task.
                  </p>
                </section>
              </>
            }
          />
        </article>
      );

    case 'scriptvm':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Scripting &amp; AI Tasks</span>
            <h1 className="doc-main-title">ScriptVM Pipeline &amp; Bindings</h1>
            <p className="doc-lead-para">
              JustLive contains an isolated, stack-based bytecode virtual machine (ScriptVM) to compile and execute gameplay logic securely at runtime.
            </p>
          </header>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="scriptvm-stages">Bytecode Scripting (.sc)</h2>
                  <p>
                    Create mission logic and ambient population scripts directly in <code>Scripts/RAW/*.sc</code>. These are automatically hot-reloaded by the engine on file save.
                  </p>
                  <GodCodeBlock
                    language="sc"
                    code={`// Example .sc mission logic
Task->MoveTo(Ped, TargetLoc);
UI->ShowNotification("Mission Started");`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="scriptvm-bindings">Auto-Binding Reflection API (SDK)</h2>
                  <p>
                    Expose your custom C++ gameplay functions to the VM using the <code>ScriptBind</code> metadata.
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`UFUNCTION(BlueprintCallable, meta = (ScriptBind = "true", ScriptName="MoveTo", ScriptCategory="Task"))
static void MoveTo(APed* Ped, FVector Location);`}
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

/**
 * Returns the outline <li> links for the given docId,
 * or null if this category doesn't own that id.
 */
export function getOutline(docId) {
  switch (docId) {

    case 'aischeduling':
      return (
        <>
          <li><a href="#aischeduling-slots">Parallel Slots</a></li>
          <li><a href="#aischeduling-priorities">Priority Rings</a></li>
        </>
      );

    case 'scriptvm':
      return (
        <>
          <li><a href="#scriptvm-stages">Compiler Flow</a></li>
          <li><a href="#scriptvm-bindings">Auto-Binding Reflection</a></li>
        </>
      );

    default: return null;
  }
}
