"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { StepIndicator } from "@/components/borrower/StepIndicator";
import api from "@/lib/api";

export default function UploadSlipPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState<string | null>(null);

  const handleFile = (f: File) => {
    setError("");
    const allowed = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(f.type)) { setError("Only PDF, JPG, PNG allowed"); return; }
    if (f.size > 5 * 1024 * 1024) { setError("File must be under 5 MB"); return; }
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("salarySlip", file);
      const res = await api.post("/api/borrower/upload-salary-slip", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploaded(res.data.fileUrl);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!uploaded) { setError("Please upload your salary slip first"); return; }
    sessionStorage.setItem("salarySlipUrl", uploaded);
    router.push("/apply/loan-config");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <StepIndicator current={3} />
      <h1 className="text-xl font-bold text-slate-900 mb-1">Salary Slip</h1>
      <p className="text-sm text-slate-500 mb-6">Upload your latest salary slip for verification</p>

      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors mb-4 ${
          file ? "border-emerald-400 bg-emerald-50" : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50"
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {file ? (
          <div className="space-y-1">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-medium text-emerald-700">{file.name}</p>
            <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB</p>
          </div>
        ) : (
          <div className="space-y-2">
            <svg className="w-10 h-10 text-slate-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-slate-600 font-medium">Drop file here or click to browse</p>
            <p className="text-xs text-slate-400">PDF, JPG, PNG — max 5 MB</p>
          </div>
        )}
      </div>

      {uploaded && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Uploaded successfully!
        </div>
      )}

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="flex gap-3">
        {!uploaded ? (
          <Button className="w-full" size="lg" onClick={handleUpload} disabled={!file} loading={loading}>
            Upload Salary Slip
          </Button>
        ) : (
          <Button className="w-full" size="lg" onClick={handleNext}>
            Continue →
          </Button>
        )}
      </div>
    </div>
  );
}