import React, { useRef, useState, useEffect, useMemo, Fragment } from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Icon,
  Inline,
  ModalBase,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { TimelineSlice as Timeline } from '@island.is/web/graphql/schema'
import cn from 'classnames'
import * as timelineStyles from './TimelineSlice.css'
import * as eventStyles from './Event.css'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import Link from 'next/link'
import ReactDOM from 'react-dom'
import { renderSlices, SliceType } from '@island.is/island-ui/contentful'
import flatten from 'lodash/flatten'

function setDefault<K, V>(map: Map<K, V>, key: K, value: V): V {
  if (!map.has(key)) map.set(key, value)
  return map.get(key) as V
}

const mapEvents = (
  events: Timeline['events'],
): Map<number, Map<number, Timeline['events']>> => {
  events = events
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .reverse()

  const byYear = new Map()
  for (const event of events) {
    const byMonth = setDefault(
      byYear,
      new Date(event.date).getFullYear(),
      new Map(),
    )
    setDefault(
      byMonth,
      new Date(event.date).getMonth(),
      [] as Timeline['events'],
    ).push(event)
  }

  return byYear
}

const getTimeline = (
  eventMap: Map<number, Map<number, Timeline['events']>>,
  getMonthByIndex,
) => {
  let i = 0
  let offset = 50
  let lastTimestamp = 0

  let currentMonth = 0

  const items = []

  const today = new Date()
  today.setMonth(today.getMonth() - 1)

  Array.from(eventMap.entries(), ([year, eventsByMonth]) => {
    Array.from(eventsByMonth.entries(), ([month, monthEvents]) => {
      const monthDate = new Date(`${year}-${month + 1}`)

      // we want to find the closest month to today and center the timeline view on it
      if (currentMonth === 0 && monthDate >= today) {
        currentMonth = offset
      }

      offset += 100
      items.push(
        <MonthItem
          month={getMonthByIndex(month)}
          year={year.toString()}
          offset={offset}
        />,
      )
      monthEvents.map((event, idx) => {
        // we increase the space between items if they are far apart in time
        const timestamp = new Date(event.date).getTime()
        offset +=
          idx > 0
            ? Math.max(90, Math.min(160, (timestamp - lastTimestamp) / 4320000))
            : 100
        items.push(
          <>
            <TimelineItem
              event={event}
              offset={offset}
              index={i}
              detailed={!!event.body}
            />
            <BulletLine
              offset={offset}
              angle={90 + (i % 2) * 180}
              length={i % 4 > 1 ? 'long' : 'short'}
            />
          </>,
        )
        i++
        lastTimestamp = timestamp
      })
    })
  })

  return { currentMonth, items }
}

interface SliceProps {
  slice: Timeline
}

export const TimelineSlice: React.FC<SliceProps> = ({ slice }) => {
  const { getMonthByIndex } = useDateUtils()

  const frameRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(-1)

  const eventMap = useMemo(() => mapEvents(slice.events), [slice.events])

  const { currentMonth, items } = useMemo(
    () => getTimeline(eventMap, getMonthByIndex),
    [],
  )

  const moveTimeline = (dir: 'left' | 'right') => {
    if (dir === 'right') {
      setPosition(
        Math.min(
          position + 500,
          frameRef.current.scrollWidth - frameRef.current.offsetWidth + 50,
        ),
      )
    } else {
      setPosition(Math.max(position - 500, 0))
    }
  }

  useEffect(() => {
    setPosition(currentMonth - 100)
    frameRef.current.scrollTo({
      left: currentMonth - 100,
    })
  }, [currentMonth])

  useEffect(() => {
    // used to ignore initial state
    if (position < 0) return

    frameRef.current.scrollTo({
      left: position,
      behavior: 'smooth',
    })
  }, [position])

  const months = flatten(
    Array.from(eventMap).map((x) => {
      return Array.from(x[1]).map((y) => {
        return { year: x[0], month: y[0] }
      })
    }),
  )

  const [month, setMonth] = useState(() => {
    const today = new Date()

    const futureMonths = months
      .map((x, idx) =>
        x.year >= today.getFullYear() && x.month >= today.getMonth() ? idx : 0,
      )
      .filter((x) => x > 0)

    if (futureMonths.length === 0) {
      return 0
    }
    return Math.min(...futureMonths)
  })

  const monthEvents = eventMap.get(months[month].year).get(months[month].month)

  return (
    <section
      key={slice.id}
      id={slice.id}
      aria-labelledby={'sliceTitle-' + slice.id}
    >
      <GridContainer>
        <Box paddingLeft={1}>
          <GridContainer>
            <GridRow>
              <GridColumn
                span={['9/9', '9/9', '7/9']}
                offset={['0', '0', '1/9']}
              >
                <Box
                  borderTopWidth="standard"
                  borderColor="standard"
                  paddingTop={6}
                >
                  <Text variant="h2" paddingBottom={3}>
                    {slice.title}
                  </Text>
                  <Text>{slice.intro}</Text>
                </Box>
              </GridColumn>
            </GridRow>
          </GridContainer>
          <Hidden below="lg">
            <div className={timelineStyles.timelineContainer}>
              <ArrowButtonShadow type="prev">
                <ArrowButton
                  type="prev"
                  onClick={() => moveTimeline('left')}
                  disabled={position === 0}
                />
              </ArrowButtonShadow>
              <ArrowButtonShadow type="next">
                <ArrowButton
                  type="next"
                  onClick={() => moveTimeline('right')}
                  disabled={
                    frameRef.current?.scrollWidth -
                      frameRef.current?.offsetWidth ===
                    position
                  }
                />
              </ArrowButtonShadow>
              <div className={timelineStyles.timelineGradient} />
              <div ref={frameRef} className={timelineStyles.timelineComponent}>
                {items}
              </div>
            </div>
          </Hidden>
          <Hidden above="md">
            <div
              className={timelineStyles.timelineContainer}
              style={{
                height: 140 + monthEvents.length * 104,
              }}
            >
              <ArrowButtonShadow type="prev">
                <ArrowButton
                  type="prev"
                  onClick={() => setMonth(Math.max(0, month - 1))}
                />
              </ArrowButtonShadow>
              <ArrowButtonShadow type="next">
                <ArrowButton
                  type="next"
                  onClick={() =>
                    setMonth(Math.min(months.length - 1, month + 1))
                  }
                />
              </ArrowButtonShadow>
              <div className={timelineStyles.monthItem}>
                <Text color="blue600" variant="h2">
                  {months[month].year}
                </Text>
                <Text color="blue600" variant="eyebrow">
                  {getMonthByIndex(months[month].month)}
                </Text>
              </div>
              <div className={timelineStyles.mobileContainer}>
                {monthEvents.map((event) => (
                  <TimelineItem
                    event={event}
                    offset={0}
                    index={0}
                    detailed={!!event.body}
                    mobile={true}
                  />
                ))}
              </div>
            </div>
          </Hidden>
        </Box>
      </GridContainer>
    </section>
  )
}

interface ArrowButtonShadowProps {
  type: 'prev' | 'next'
}

const ArrowButtonShadow: React.FC<ArrowButtonShadowProps> = ({
  children,
  type,
}) => {
  return (
    <div className={timelineStyles.arrowButtonShadow[type]}>{children}</div>
  )
}

interface ArrowButtonProps {
  type: 'prev' | 'next'
  disabled?: boolean
  onClick: () => void
}

const ArrowButton = ({
  type = 'prev',
  disabled = false,
  onClick,
}: ArrowButtonProps) => {
  return (
    <Box
      className={cn(
        timelineStyles.arrowButton,
        timelineStyles.arrowButtonTypes[type],
      )}
    >
      <Button
        colorScheme="light"
        circle
        icon="arrowBack"
        disabled={disabled}
        onClick={onClick}
      />
    </Box>
  )
}

const TimelineItem = ({ event, offset, index, detailed, mobile = false }) => {
  const positionStyles = [
    { bottom: 136 },
    { top: 136 },
    { bottom: 20 },
    { top: 20 },
  ]
  const style = mobile
    ? {}
    : {
        left: offset - 208,
        alignItems: index % 2 ? 'flex-end' : 'flex-start',
        ...positionStyles[index % 4],
      }

  const [visible, setVisible] = useState(false)
  const portalRef = useRef()

  useEffect(() => {
    portalRef.current = document.querySelector('#__next')
  })

  return detailed ? (
    <div
      className={timelineStyles.item}
      style={{
        alignItems: index % 2 ? 'flex-end' : 'flex-start',
        ...style,
      }}
    >
      <div
        className={timelineStyles.detailedItem}
        onClick={() => setVisible(true)}
      >
        <div className={timelineStyles.itemText}>{event.title}</div>
      </div>
      {visible &&
        ReactDOM.createPortal(
          <ModalBase
            baseId="eventDetails"
            isVisible={true}
            initialVisibility={true}
            onVisibilityChange={(isVisible) => !isVisible && setVisible(false)}
            hideOnEsc={true}
          >
            <EventModal event={event} onClose={() => setVisible(false)} />
          </ModalBase>,
          portalRef.current,
        )}
    </div>
  ) : (
    <div className={timelineStyles.item} style={style}>
      <div
        className={timelineStyles.basicItem}
        style={{ alignItems: index % 2 ? 'flex-end' : 'flex-start' }}
      >
        <div className={timelineStyles.itemText}>{event.title}</div>
      </div>
    </div>
  )
}

const BulletLine = ({
  offset,
  angle,
  length = 'short',
  selected = false,
}: {
  offset: number
  angle: number
  length: 'short' | 'long'
  selected?: boolean
}) => {
  return (
    <div
      className={timelineStyles.bulletLine}
      style={{
        left: offset - 12,
        transform: `rotate(${angle}deg)`,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="244"
        height="24"
        fill="none"
        viewBox="0 0 244 24"
      >
        <path
          fill={selected ? '#ff0050' : '#99c0ff'}
          fillRule="evenodd"
          d={
            length === 'short'
              ? 'M118.126 13A4.002 4.002 0 00126 12a4 4 0 00-8 0H24c0-6.627-5.373-12-12-12S0 5.373 0 12s5.373 12 12 12c6.29 0 11.45-4.84 11.959-11h94.167zM8 12a4 4 0 108 0 4 4 0 00-8 0z'
              : 'M234.126 13c1.185 4.535 7.86 3.687 7.874-1 0-5.333-8-5.333-8 0H24c0-6.627-5.373-12-12-12S0 5.373 0 12s5.373 12 12 12c6.29 0 11.45-4.84 11.959-11zM8 12c0 5.333 8 5.333 8 0s-8-5.333-8 0z'
          }
          clipRule="evenodd"
        ></path>
      </svg>
    </div>
  )
}

const MonthItem = ({ month, offset, year = '' }) => {
  return (
    <div className={timelineStyles.monthItem} style={{ left: offset }}>
      <Text color="blue600" variant="eyebrow">
        {month}
      </Text>
      <Text color="blue600" variant="eyebrow">
        {year}
      </Text>
    </div>
  )
}

interface EventModalProps {
  event: Timeline['events'][0]
  onClose: () => void
}

const formatNumber = (value: number) =>
  value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')

const EventModal = ({ event, onClose }: EventModalProps) => {
  if (!event) {
    return null
  }

  return (
    <div className={eventStyles.eventModal}>
      <Box
        className={eventStyles.eventBarTitle}
        background="white"
        display="inlineFlex"
      >
        <Box className={eventStyles.eventBarIcon}>
          <Icon type="filled" icon="person" color="purple400" size="medium" />
        </Box>
        {!!event.numerator && (
          <Box
            display="inlineFlex"
            alignItems="center"
            className={eventStyles.nowrap}
            paddingLeft={2}
            paddingRight={4}
          >
            <Text variant="h2" color="purple400" as="span">
              {formatNumber(event.numerator)}
            </Text>
            {!!event.denominator && (
              <Text variant="h2" color="purple400" as="span" fontWeight="light">
                /{formatNumber(event.denominator)}
              </Text>
            )}
            <Box marginLeft={1}>
              <Text variant="eyebrow" color="purple400" fontWeight="semiBold">
                {event.label?.split(/[\r\n]+/).map((line, i) => (
                  <Fragment key={i}>
                    {line}
                    <br />
                  </Fragment>
                ))}
              </Text>
            </Box>
          </Box>
        )}
      </Box>
      <Box padding={6}>
        <Box className={eventStyles.eventModalClose}>
          <Button
            circle
            colorScheme="negative"
            icon="close"
            onClick={onClose}
          />
        </Box>
        <Stack space={2}>
          <Text variant="h2" as="h3">
            {event.title}
          </Text>
          {event.tags && (
            <Inline space={2}>
              {event.tags.map((label, index) => (
                <Tag key={index} variant="purple" outlined>
                  {label}
                </Tag>
              ))}
            </Inline>
          )}
          {Boolean(event.body) &&
            renderSlices([(event.body as unknown) as SliceType])}
          {event.link && (
            <Link href={event.link}>
              <Button variant="text" icon="arrowForward">
                Lesa meira
              </Button>
            </Link>
          )}
        </Stack>
      </Box>
    </div>
  )
}
