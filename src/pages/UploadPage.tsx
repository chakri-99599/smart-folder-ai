import AppLayout from "@/components/AppLayout";
import FileUploadZone from "@/components/FileUploadZone";

const UploadPage = () => {
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Upload Files</h1>
        <p className="text-muted-foreground mt-1">Upload text or PDF files for automatic semantic classification</p>
      </div>
      <div className="max-w-2xl">
        <FileUploadZone />
      </div>
    </AppLayout>
  );
};

export default UploadPage;
