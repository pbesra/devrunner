import { useEffect } from "react";

const APP_NAME = "Devrunner";

export function usePageTitle(pageTitle?: string) {
  useEffect(() => {
    document.title = pageTitle ? `${APP_NAME} | ${pageTitle}` : APP_NAME;
    return () => { document.title = APP_NAME; };
  }, [pageTitle]);
}