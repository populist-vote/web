import { Layout, TextInput } from "components";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { dashboardNavItems } from "utils/nav";

function EmbedsNew() {
  const router = useRouter();
  const navItems = dashboardNavItems(router);
  const { register } = useForm();
  return (
    <Layout navItems={navItems}>
      <h2>New Embed</h2>
      <form>
        <TextInput
          name="name"
          id="name"
          label="Name"
          placeholder={"Name"}
          size="medium"
          hideLabel
          register={register}
        />
      </form>
    </Layout>
  );
}

export default EmbedsNew;
