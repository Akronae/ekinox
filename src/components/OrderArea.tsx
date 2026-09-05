import {
  Box,
  Container,
  Group,
  Stack,
  Table,
  Textarea,
  Title,
} from "@mantine/core";
import { title } from "radashi";
import { useState } from "react";
import { getBill } from "~/business/getBill";
import { formatCurrency } from "~/utils/formatCurrency";

export function OrderArea() {
  const [rawContent, setRawContent] = useState("");

  const bill = getBill(rawContent.split("\n"));

  return (
    <Container
      pt={"xl"}
      pb={"xl"}
      h={"100vh"}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Stack style={{ flex: 1, minHeight: 0 }}>
        <Title c={"white"}>💽 EkinoxTV</Title>
        <Group gap={"10%"} align="start" style={{ flex: 1, minHeight: 0 }}>
          <Box
            style={{ flex: 1, height: "100%", minHeight: 0, display: "flex" }}
          >
            <Textarea
              flex={1}
              placeholder={
                "Back to the Future 1\nBack to the Future 2\nBack to the Future 3\nLa chèvre"
              }
              size="lg"
              label="Choisissez vos films"
              autosize
              minRows={5}
              onChange={(e) => setRawContent(e.target.value)}
              value={rawContent}
              styles={{
                root: {
                  display: "flex",
                  flexDirection: "column",
                },
                wrapper: { flex: 1, minHeight: 0 },
                input: { height: "100%", maxHeight: "100%", overflowY: "auto" },
              }}
            />
          </Box>

          <Stack flex={1} style={{ height: "100%", minHeight: 0 }}>
            <Title order={2}>Mon Panier</Title>
            <Box flex={1} mih={0} style={{ overflowY: "auto" }}>
              <Table.ScrollContainer minWidth={0}>
                <Table fz={"lg"} highlightOnHover>
                  <Table.Tbody>
                    {bill.items.map((x) => (
                      <Table.Tr>
                        <Table.Td>
                          {x.units}x {title(x.label)}
                        </Table.Td>
                        <Table.Td ta={"end"}>
                          {formatCurrency(x.value)}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                    <Table.Tr bg={"dark.5"}>
                      <Table.Td>{title(bill.subTotal.label)}</Table.Td>
                      <Table.Td ta={"end"}>
                        {formatCurrency(bill.subTotal.value)}
                      </Table.Td>
                    </Table.Tr>
                    {bill.discounts.map((x) => (
                      <Table.Tr bg={"dark.6"}>
                        <Table.Td>{title(x.label)}</Table.Td>
                        <Table.Td ta={"end"}>
                          {formatCurrency(-x.value)}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                    <Table.Tr bg={"dark.5"}>
                      <Table.Td>{title(bill.total.label)}</Table.Td>
                      <Table.Td ta={"end"}>
                        {formatCurrency(bill.total.value)}
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Box>
          </Stack>
        </Group>
      </Stack>
    </Container>
  );
}
