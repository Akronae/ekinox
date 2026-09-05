import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import { OrderArea } from "~/components/OrderArea";
import { theme } from "~/theme";

export default function App() {
  return (
    <MantineProvider theme={theme} forceColorScheme="dark">
      <OrderArea />
    </MantineProvider>
  );
}
