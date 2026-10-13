export default function RunWorkflow (){
  const [wf, setWf] = useState(WORKFLOWS[0].id);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
 
  const upload = () => setFile({ name: "employees.csv", records: 10240 });
  const process = () => {
    setStatus("running"); setProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += 20;
      if (p >= 100) { clearInterval(iv); setStatus("done"); setProgress(100); }
      else setProgress(p);
    }, 300);
  };
  const steps = ["Uploading", "Mapping", "Transforming", "Validating", "Generating"];
  const doneCount = status === "done" ? 5 : Math.floor(progress / 20);
 
  return (
    <div className="max-w-xl mx-auto">
      <SectionHeader title="Run workflow" desc="Select a workflow, upload your file, and get your processed result." />
      <Card className="p-6">
        <Field label="Select workflow">
          <Select value={wf} onChange={(e) => setWf(e.target.value)}>
            {WORKFLOWS.filter((w) => w.status === "Published").map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </Select>
        </Field>
 
        <div className="mt-5">
          <span style={{ color: "var(--text-2)", fontFamily: FONT_UI }} className="text-[12.5px] font-medium block mb-1.5">Upload file</span>
          {!file ? (
            <button onClick={upload} style={{ border: "1.5px dashed var(--border-strong)", background: "var(--surface-2)" }}
              className="w-full rounded-xl py-10 flex flex-col items-center gap-2 hover:border-[var(--accent)]">
              <Upload size={20} style={{ color: "var(--text-3)" }} />
              <div style={{ color: "var(--text)", fontFamily: FONT_UI }} className="text-[13.5px] font-medium">Drop your file here</div>
              <div style={{ color: "var(--text-3)", fontFamily: FONT_UI }} className="text-[12.5px]">or <span style={{ color: "var(--accent)" }} className="font-medium">browse files</span></div>
            </button>
          ) : (
            <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }} className="rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <div style={{ color: "var(--text)", fontFamily: FONT_MONO }} className="text-[13px] font-medium">{file.name}</div>
                <div style={{ color: "var(--text-3)", fontFamily: FONT_UI }} className="text-[12px]">{file.records.toLocaleString()} records</div>
              </div>
              <button onClick={() => { setFile(null); setStatus("idle"); }}><X size={15} style={{ color: "var(--text-3)" }} /></button>
            </div>
          )}
        </div>
 
        {file && status === "idle" && (
          <Button className="w-full justify-center mt-5" icon={PlayCircle} onClick={process}>Process file</Button>
        )}
 
        {status !== "idle" && (
          <div className="mt-6">
            <div style={{ color: "var(--text)", fontFamily: FONT_UI }} className="text-[13.5px] font-semibold mb-3">{status === "done" ? "Completed" : "Processing…"}</div>
            <div className="space-y-2.5 mb-5">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2.5">
                  {i < doneCount ? <CircleCheck size={16} style={{ color: "var(--green)" }} /> : i === doneCount && status === "running" ? <Loader2 size={16} style={{ color: "var(--accent)" }} className="animate-spin" /> : <div style={{ border: "1.5px solid var(--border-strong)" }} className="w-4 h-4 rounded-full" />}
                  <span style={{ color: i < doneCount ? "var(--text)" : "var(--text-3)", fontFamily: FONT_UI }} className="text-[13px] font-medium">{s}</span>
                </div>
              ))}
            </div>
            {status === "done" && (
              <>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <Card className="p-3.5 text-center"><div style={{ color: "var(--text)", fontFamily: FONT_UI }} className="text-[18px] font-semibold">10,240</div><div style={{ color: "var(--text-3)", fontFamily: FONT_UI }} className="text-[11px] mt-0.5">records</div></Card>
                  <Card className="p-3.5 text-center" style={{ background: "var(--green-soft)" }}><div style={{ color: "var(--green)", fontFamily: FONT_UI }} className="text-[18px] font-semibold">9,982</div><div style={{ color: "var(--green)", fontFamily: FONT_UI }} className="text-[11px] mt-0.5">successful</div></Card>
                  <Card className="p-3.5 text-center" style={{ background: "var(--amber-soft)" }}><div style={{ color: "var(--amber)", fontFamily: FONT_UI }} className="text-[18px] font-semibold">258</div><div style={{ color: "var(--amber)", fontFamily: FONT_UI }} className="text-[11px] mt-0.5">warnings</div></Card>
                </div>
                <div className="flex gap-2">
                  <Button icon={Download} className="flex-1 justify-center">Download output</Button>
                  <Button variant="secondary" className="flex-1 justify-center">View results</Button>
                </div>
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
 
