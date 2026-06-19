import { useUser } from "@clerk/expo";
import { useGlobalSearchParams, usePathname } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import { usePostHog } from "posthog-react-native";

const toPostHogProperties = (params: Record<string, string | string[]>) =>
  Object.entries(params).reduce<Record<string, string | string[]>>(
    (properties, [key, value]) => {
      if (typeof value === "string" || Array.isArray(value)) {
        properties[key] = value;
      }

      return properties;
    },
    {},
  );

const compactUserProperties = (properties: Record<string, string | null | undefined>) =>
  Object.entries(properties).reduce<Record<string, string>>(
    (compactProperties, [key, value]) => {
      if (value) {
        compactProperties[key] = value;
      }

      return compactProperties;
    },
    {},
  );

export function PostHogTracker() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const posthog = usePostHog();
  const { isLoaded, user } = useUser();
  const lastIdentifiedUserId = useRef<string | null>(null);

  const screenProperties = useMemo(
    () => toPostHogProperties(params as Record<string, string | string[]>),
    [params],
  );

  const serializedScreenProperties = useMemo(
    () => JSON.stringify(screenProperties),
    [screenProperties],
  );

  useEffect(() => {
    if (!pathname) {
      return;
    }

    posthog.screen(pathname, screenProperties);
  }, [pathname, posthog, screenProperties, serializedScreenProperties]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!user) {
      if (lastIdentifiedUserId.current) {
        posthog.reset();
        lastIdentifiedUserId.current = null;
      }

      return;
    }

    if (lastIdentifiedUserId.current === user.id) {
      return;
    }

    posthog.identify(user.id, compactUserProperties({
      email: user.primaryEmailAddress?.emailAddress,
      first_name: user.firstName,
      last_name: user.lastName,
      name: user.fullName,
      username: user.username,
    }));
    lastIdentifiedUserId.current = user.id;
  }, [isLoaded, posthog, user]);

  return null;
}
