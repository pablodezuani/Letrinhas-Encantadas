"use client"

import { useCallback, useState } from "react"
import { FlatList, View, StyleSheet, RefreshControl } from "react-native"
import { ChildCard } from "./ChildCard"
import { Child } from "../../lib/types"
import { EmptyState } from "./empty-state"


interface ChildrenListProps {
  children: Child[]
  onChildSelect: (child: Child) => void
  searchQuery: string
  onAddChild: () => void
}

export function ChildrenList({ children, onChildSelect, searchQuery, onAddChild }: ChildrenListProps) {
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setRefreshing(false)
  }, [])

  const renderChild = useCallback(
    ({ item }: { item: Child }) => <ChildCard child={item} onSelect={() => onChildSelect(item)} />,
    [onChildSelect],
  )

  const renderSeparator = useCallback(() => <View style={styles.separator} />, [])

  if (children.length === 0) {
    return <EmptyState searchQuery={searchQuery} onAddChild={onAddChild} />
  }

  return (
    <FlatList
      data={children}
      keyExtractor={(item) => item.id}
      renderItem={renderChild}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={renderSeparator}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#6C63FF"]}
          tintColor="#6C63FF"
          progressBackgroundColor="#fff"
        />
      }
    />
  )
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  separator: {
    height: 20,
  },
})
