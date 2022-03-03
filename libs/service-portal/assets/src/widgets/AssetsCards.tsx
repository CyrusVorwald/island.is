import React from 'react'

import { Box, Column, Columns, Text } from '@island.is/island-ui/core'
import {
  EventCard,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'

const AssetsCards: ServicePortalModuleComponent = () => {
  return (
    <Box>
      <Columns>
        <Column width="1/2">
          <EventCard
            title="Fasteignir"
            image="//images.ctfassets.net/8k0h54kbe6bj/4uI4AHH4fpT052SPhrfBsG/f2cd83c61a86ceb248c8f43880ff34fb/life-event-ad-flytja.png"
            url="/"
            renderContent={() => (
              <Box>
                <Text>Kjartansgata 2</Text>
                <Text>
                  <strong>Sveitarfélag: </strong>
                  105 Reykjavík
                </Text>
                <Text>
                  <strong>Stærð: </strong>
                  151.4 fm
                </Text>
              </Box>
            )}
          />
        </Column>
      </Columns>
    </Box>
  )
}

export default AssetsCards
