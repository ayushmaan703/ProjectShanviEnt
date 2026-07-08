import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { getAllCustomers } from "../store/slice/Customer.slice";
import { useDispatch, useSelector } from "react-redux";
import { RefreshControl } from "react-native-gesture-handler";

const UserHomeDashboard = () => {

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const drawerNavigation = navigation.getParent();

  const customerList = useSelector((state) => state.customer.customerList) || [];

  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const filteredCustomers = useMemo(() => {
    return customerList.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.includes(search);

      const matchesFilter =
        selectedFilter === "all"
          ? true
          : selectedFilter === "approved"
            ? customer.verified
            : !customer.verified;

      return matchesSearch && matchesFilter;
    });
  }, [customerList, search, selectedFilter]);

  useEffect(() => {
    dispatch(getAllCustomers());
  }, []);

  const renderCustomer = ({ item }) => (
    <TouchableOpacity
      style={styles.customerCard}
      onPress={() => navigation.navigate("CustomerDetails", { customer: item })}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.customerName}>{item.name}</Text>

        <Text style={styles.customerInfo}>📞 {item.contactNo}</Text>

        <Text style={styles.customerInfo}>📍 {item.contactPerson}</Text>
      </View>

      <View
        style={[
          styles.statusBadge,
          item.verified
            ? styles.approvedBadge
            : styles.pendingBadge,
        ]}
      >
        <Text style={styles.statusText}>
          {item.verified ? "Approved" : "Pending"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getAllCustomers());
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  useEffect(() => {
    if (isFocused) {
      onRefresh()
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {/* NAVBAR */}

      <View style={styles.navContainer}>
        <TouchableOpacity
          style={[styles.iconButton, styles.leftButton]}
          onPress={() => drawerNavigation.openDrawer()}
        >
          <FontAwesome6 name="bars" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.navbar}>
          <Text style={styles.title}>Shanvi Entprises</Text>
        </View>
      </View>

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <FontAwesome6
          name="magnifying-glass"
          size={18}
          color="#888"
        />

        <TextInput
          placeholder="Search Customer..."
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* FILTERS */}

      <View style={styles.filterContainer}>
        {["all", "approved", "pending"].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setSelectedFilter(item)}
            style={[
              styles.filterButton,
              selectedFilter === item && styles.activeFilter,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === item &&
                styles.activeFilterText,
              ]}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST */}

      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={filteredCustomers}
        keyExtractor={(item) => item._id}
        renderItem={renderCustomer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <FontAwesome6
              name="users"
              size={45}
              color="#999"
            />

            <Text style={styles.emptyText}>
              No Customers Found
            </Text>
          </View>
        )}
      />

      {/* FLOATING BUTTON */}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateCustomer")}
      >
        <FontAwesome6
          name="plus"
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
};

export default UserHomeDashboard;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e2e2e2",
    marginTop: 20,
  },

  navContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginTop: 12,
  },

  navbar: {
    width: "95%",
    height: 65,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(74,144,226,0.88)",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },

    elevation: 10,
  },

  title: {
    color: "#fff",
    fontSize: 21,
    letterSpacing: 2,
    fontFamily:
      "Merriweather_24pt_SemiCondensed-SemiBold",
  },

  iconButton: {
    position: "absolute",
    zIndex: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 12,
    borderRadius: 30,
    elevation: 15,
  },

  leftButton: {
    left: 20,
    top: 6,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 18,
    paddingHorizontal: 15,
    elevation: 4,
  },

  searchInput: {
    flex: 1,
    height: 52,
    marginLeft: 10,
    color: "#000",
    fontSize: 15,
  },

  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 18,
  },

  filterButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    elevation: 3,
  },

  activeFilter: {
    backgroundColor: "rgba(74,144,226,0.88)",
  },

  filterText: {
    color: "#555",
    fontWeight: "600",
  },

  activeFilterText: {
    color: "#fff",
  },

  customerCard: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 14,
    borderRadius: 18,
    padding: 18,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    elevation: 5,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  customerName: {
    fontSize: 18,
    color: "#111",
    marginBottom: 8,
    fontFamily: "Merriweather_24pt-Bold",
  },

  customerInfo: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
    fontFamily: "Merriweather_24pt-SemiBold",
  },

  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
  },

  approvedBadge: {
    backgroundColor: "#4CAF50",
  },

  pendingBadge: {
    backgroundColor: "#FF9800",
  },

  statusText: {
    color: "#fff",
    fontWeight: "700",
  },

  fab: {
    position: "absolute",
    right: 25,
    bottom: 25,
    width: 65,
    height: 65,
    borderRadius: 35,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#4A90E2",

    elevation: 10,

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 120,
  },

  emptyText: {
    marginTop: 15,
    fontSize: 18,
    color: "#777",
    fontFamily:
      "Merriweather_24pt_SemiCondensed-Regular",
  },
});