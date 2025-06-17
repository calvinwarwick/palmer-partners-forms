
import { useEffect } from "react";
import TenancyApplicationForm from "@/components/TenancyApplicationForm";

const Application = () => {
  useEffect(() => {
    document.title = "Tenancy Application | Palmer & Partners";
  }, []);

  return <TenancyApplicationForm />;
};

export default Application;
