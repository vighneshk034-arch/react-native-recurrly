import "@/global.css";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useState } from "react";
import dayjs from "dayjs";

import images from "@/constants/images";
import { icons } from "@/constants/icons";
import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  HOME_USER,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";

import Listheading from "@/components/listheading";
import UpcomingSubscriptionCard from "@/components/upcomingSubscriptionCard";
import SubscriptionCard from "@/components/SubscriptionCard";

const SafeAreaView = styled(RNSafeAreaView);

function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export default function App() {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);

  return (
    <SafeAreaView className="flex-1 bg-background p-5">

        <FlatList
          ListHeaderComponent={() => (
            <>
                    <View className="home-header">
        <View className="home-user">
          <Image source={images.avatar} className="home-avatar" />
          <Text className="home-user-name">{HOME_USER.name}</Text>
        </View>

        <Image source={icons.add} className="home-add-icon" />
      </View>

      <View className="home-balance-card">
        <Text className="home-balance-label">Balance</Text>

        <View className="home-balance-row">
          <Text className="home-balance-amount">
            {formatCurrency(HOME_BALANCE.amount)}
          </Text>

          <Text className="home-balance-date">
            {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
          </Text>
        </View>
      </View>

      <View className="mb-5">
        <Listheading title="Upcoming" />

        <FlatList
          data={UPCOMING_SUBSCRIPTIONS}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UpcomingSubscriptionCard {...item} />
          )}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="home-empty-state">
              No upcoming renewals yet.
            </Text>
          }
        />
      </View>       
              <Listheading title="All Subscriptions" />
     
            </>
          )}
          data={HOME_SUBSCRIPTIONS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SubscriptionCard
              {...item}
              expanded={expandedSubscriptionId === item.id}
              onPress={() =>
                setExpandedSubscriptionId((currentId) =>
                  currentId === item.id ? null : item.id
                )
              }
            />
          )}

          extraData={expandedSubscriptionId}
          ItemSeparatorComponent={() => <View className="h-4" />}
          showsVerticalScrollIndicator = {false}

          ListEmptyComponent={
            <Text className="home-empty-state">
              No subscriptions yet.
            </Text>
          }

          contentContainerClassName="pb-30"
        />
    </SafeAreaView>
  );
}