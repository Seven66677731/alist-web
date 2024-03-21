import {
  HStack,
  useColorModeValue,
  Image,
  Center,
  Icon,
  IconButton,
  CenterProps,
  Kbd,
} from "@hope-ui/solid"
import { Show, createMemo, Switch, Match } from "solid-js"
import { getSetting, layout, local, objStore, State } from "~/store"
import { CenterLoading } from "~/components"
import { Container } from "../Container"
import { bus } from "~/utils"
import { Layout } from "./layout"
import { BsSearch } from "solid-icons/bs"
import { AiOutlineFileSearch } from "solid-icons/ai"
import { TbListSearch } from "solid-icons/tb"
import { isMac } from "~/utils/compatibility"

export const Header = () => {
  const logos = getSetting("logo").split("\n")
  const logo = useColorModeValue(logos[0], logos.pop())

  const stickyProps = createMemo<CenterProps>(() => {
    switch (local["position_of_header_navbar"]) {
      case "sticky":
        return { position: "sticky", zIndex: "$sticky", top: 0 }
      default:
        return { position: undefined, zIndex: undefined, top: undefined }
    }
  })

  return (
    <Center
      {...stickyProps}
      bgColor="$background"
      class="header"
      w="$full"
      // shadow="$md"
    >
      <Container>
        <HStack
          px="calc(2% + 0.5rem)"
          py="$2"
          w="$full"
          justifyContent="space-between"
        >
          <HStack class="header-left" h="44px">
            <Image
              src={logo()!}
              h="$full"
              w="auto"
              fallback={<CenterLoading />}
            />
          </HStack>
          <HStack class="header-right" spacing="$2">
            <Show when={objStore.state === State.Folder}>
              <Kbd> {isMac ? "Cmd " : "Ctrl" + "+K 搜索"}</Kbd>
              <IconButton
                aria-label="Search"
                compact
                size="lg"
                //这次支持三个不同的图标了
                icon={
                  <Switch>
                    <Match when={layout() === "list"}>
                      <TbListSearch />
                    </Match>
                    <Match when={layout() === "grid"}>
                      <AiOutlineFileSearch />
                    </Match>
                    <Match when={layout() === "image"}>
                      <Icon as={BsSearch} />
                    </Match>
                  </Switch>
                }
                onClick={() => {
                  bus.emit("tool", "search")
                }}
              />
              <HStack></HStack>
            </Show>
            <Layout />
          </HStack>
        </HStack>
      </Container>
    </Center>
  )
}
