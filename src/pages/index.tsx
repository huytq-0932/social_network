import useBaseHook from '@src/hooks/BaseHook'
import auth from '@src/helpers/auth'
import { useEffect } from 'react';

function IndexPage() {
  const { redirect } = useBaseHook()
  useEffect(() => {
    redirect("/admin")
  },[])
  return <div>Redirecting.... </div>;
}

export default IndexPage;