
import { supabase } from '@/integrations/supabase/client';

export const TestPage = () => {
  //let res = supabase.auth.updateUser({ data: { display_name: "Sidharth Shambu" } });
  return (
    <div>
      <h1>Test Page</h1>
      <p>This is a test page.</p>
    </div>
  );
};
