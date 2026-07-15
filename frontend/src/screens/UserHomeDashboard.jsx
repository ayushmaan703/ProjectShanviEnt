import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  TextInput,
  Modal,
} from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { getAllCustomers } from "../store/slice/Customer.slice";
import { useDispatch, useSelector } from "react-redux";
import { RefreshControl } from "react-native-gesture-handler";
import { getAllUsers, getCurrUInfo } from "../store/slice/Auth.slice";

const UserHomeDashboard = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const drawerNavigation = navigation.getParent();

  const customerList = useSelector((state) => state.customer.customerList) || [];
  const userList = useSelector((state) => state.auth.userList) || [];

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all"); // all approved pending
  const [selectedPayment, setSelectedPayment] = useState("all"); // all paid unpaid
  const [selectedUser, setSelectedUser] = useState("all"); // all userId
  const [refreshing, setRefreshing] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  const currentUser = useSelector((state) => state.auth.userData);
  const isAdmin = currentUser?.role === "admin";

  const selectedUserName = useMemo(() => {
    if (selectedUser === "all") return "All Users";
    return (
      userList.find((u) => u._id === selectedUser)?.fullName || "All Users"
    );
  }, [selectedUser, userList]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedStatus !== "all") count++;
    if (selectedPayment !== "all") count++;
    if (selectedUser !== "all") count++;
    return count;
  }, [selectedStatus, selectedPayment, selectedUser]);

  const filteredCustomers = useMemo(() => {
    const searchText = search.toLowerCase();

    return customerList.filter((customer) => {
      const name = customer?.name?.toLowerCase() || "";
      const contact = String(customer?.contactNo || "");

      const matchesSearch = name.includes(searchText) || contact.includes(search);

      if (!matchesSearch) return false;

      // Normal User
      if (!isAdmin) {
        return customer.createdBy === currentUser?._id && !customer.verified;
      }

      // Admin Filters
      const matchesStatus =
        selectedStatus === "all"
          ? true
          : selectedStatus === "approved"
            ? customer.verified
            : !customer.verified;

      const matchesPayment =
        selectedPayment === "all"
          ? true
          : selectedPayment === "paid"
            ? customer.isPaid
            : !customer.isPaid;

      const matchesUser =
        selectedUser === "all" ? true : customer.createdBy === selectedUser;

      return matchesStatus && matchesPayment && matchesUser;
    });
  }, [
    customerList,
    search,
    selectedStatus,
    selectedPayment,
    selectedUser,
    currentUser,
    isAdmin,
  ]);

  useEffect(() => {
    dispatch(getAllCustomers());
    dispatch(getCurrUInfo());
    dispatch(getAllUsers());
  }, []);

  const renderCustomer = ({ item }) => (
    <TouchableOpacity
      style={styles.customerCard}
      onPress={() => navigation.navigate("CustomerDetails", { customer: item })}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.customerName}>{item?.name || "-"}</Text>
        <Text style={styles.customerInfo}>📞 {item?.contactNo || "-"}</Text>
        <Text style={styles.customerInfo}>📍 {item?.contactPerson || "-"}</Text>
      </View>

      <View
        style={[
          styles.statusBadge,
          item.verified ? styles.approvedBadge : styles.pendingBadge,
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
    dispatch(getCurrUInfo());
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  useEffect(() => {
    if (isFocused) {
      onRefresh();
    }
  }, [isFocused]);

  const resetFilters = () => {
    setSelectedStatus("all");
    setSelectedPayment("all");
    setSelectedUser("all");
  };

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

      {/* SEARCH + FILTER TRIGGER */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <FontAwesome6 name="magnifying-glass" size={18} color="#888" />
          <TextInput
            placeholder="Search Customer..."
            placeholderTextColor="#888"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {isAdmin && (
          <TouchableOpacity
            style={[
              styles.filterTrigger,
              activeFilterCount > 0 && styles.filterTriggerActive,
            ]}
            onPress={() => setFilterVisible(true)}
          >
            <FontAwesome6
              name="sliders"
              size={16}
              color={activeFilterCount > 0 ? "#fff" : "#4A90E2"}
            />
            {activeFilterCount > 0 && (
              <View style={styles.filterCountBadge}>
                <Text style={styles.filterCountText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* TOTAL COUNT */}
      <View style={styles.totalCountRow}>
        <FontAwesome6 name="users" size={12} color="#4A90E2" />
        <Text style={styles.totalCountText}>
          Showing {filteredCustomers.length}{" "}
          {filteredCustomers.length === 1 ? "Customer" : "Customers"}
        </Text>
      </View>

      {/* Active filter chips summary (optional quick glance) */}
      {isAdmin && activeFilterCount > 0 && (
        <View style={styles.activeChipsRow}>
          {selectedStatus !== "all" && (
            <View style={styles.activeChip}>
              <Text style={styles.activeChipText}>{selectedStatus}</Text>
            </View>
          )}
          {selectedPayment !== "all" && (
            <View style={styles.activeChip}>
              <Text style={styles.activeChipText}>{selectedPayment}</Text>
            </View>
          )}
          {selectedUser !== "all" && (
            <View style={styles.activeChip}>
              <Text style={styles.activeChipText}>{selectedUserName}</Text>
            </View>
          )}
          <TouchableOpacity onPress={resetFilters}>
            <Text style={styles.clearAllText}>Clear all</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* LIST */}
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={filteredCustomers}
        keyExtractor={(item) => item._id}
        renderItem={renderCustomer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <FontAwesome6 name="users" size={45} color="#999" />
            <Text style={styles.emptyText}>No Customers Found</Text>
          </View>
        )}
      />

      {/* FLOATING BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateCustomer")}
      >
        <FontAwesome6 name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {/* FILTER DROPDOWN MODAL */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setFilterVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.filterPanel}>
                <View style={styles.filterPanelHeader}>
                  <Text style={styles.filterPanelTitle}>Filters</Text>
                  <TouchableOpacity onPress={() => setFilterVisible(false)}>
                    <FontAwesome6 name="xmark" size={20} color="#555" />
                  </TouchableOpacity>
                </View>

                {/* Status */}
                <Text style={styles.sectionLabel}>Status</Text>
                <View style={styles.pillRow}>
                  {["all", "approved", "pending"].map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.pill,
                        selectedStatus === item && styles.pillActive,
                      ]}
                      onPress={() => setSelectedStatus(item)}
                    >
                      <Text
                        style={[
                          styles.pillText,
                          selectedStatus === item && styles.pillTextActive,
                        ]}
                      >
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Payment */}
                <Text style={styles.sectionLabel}>Payment</Text>
                <View style={styles.pillRow}>
                  {["all", "paid", "unpaid"].map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.pill,
                        selectedPayment === item && styles.pillActive,
                      ]}
                      onPress={() => setSelectedPayment(item)}
                    >
                      <Text
                        style={[
                          styles.pillText,
                          selectedPayment === item && styles.pillTextActive,
                        ]}
                      >
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* User - scrollable list */}
                <Text style={styles.sectionLabel}>Added By</Text>
                <FlatList
                  data={[{ _id: "all", fullName: "All Users" }, ...userList]}
                  keyExtractor={(item) => item._id}
                  style={styles.userListScroll}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.userRow,
                        selectedUser === item._id && styles.userRowActive,
                      ]}
                      onPress={() => setSelectedUser(item._id)}
                    >
                      <Text
                        style={[
                          styles.userRowText,
                          selectedUser === item._id && styles.userRowTextActive,
                        ]}
                      >
                        {item.fullName}
                      </Text>
                      {selectedUser === item._id && (
                        <FontAwesome6 name="check" size={14} color="#4A90E2" />
                      )}
                    </TouchableOpacity>
                  )}
                />

                <View style={styles.filterPanelFooter}>
                  <TouchableOpacity onPress={resetFilters}>
                    <Text style={styles.resetText}>Reset</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => setFilterVisible(false)}
                  >
                    <Text style={styles.doneButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    fontFamily: "Merriweather_24pt_SemiCondensed-SemiBold",
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

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 20,
  },

  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
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

  filterTrigger: {
    width: 52,
    height: 52,
    marginLeft: 12,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },

  filterTriggerActive: {
    backgroundColor: "#4A90E2",
  },

  filterCountBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  filterCountText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  activeChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 12,
    gap: 8,
  },

  activeChip: {
    backgroundColor: "#dceafe",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },

  activeChipText: {
    color: "#3a72c4",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  clearAllText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    textDecorationLine: "underline",
    marginLeft: 4,
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
    shadowOffset: { width: 0, height: 3 },
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
    shadowOffset: { width: 0, height: 5 },
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 120,
  },

  emptyText: {
    marginTop: 15,
    fontSize: 18,
    color: "#777",
    fontFamily: "Merriweather_24pt_SemiCondensed-Regular",
  },

  // ---- Filter dropdown modal ----
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-start",
  },

  filterPanel: {
    marginTop: 150,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    maxHeight: "65%",
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },

  filterPanelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  filterPanelTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#888",
    marginTop: 14,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  pill: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 18,
  },

  pillActive: {
    backgroundColor: "#4A90E2",
  },

  pillText: {
    color: "#555",
    fontWeight: "600",
    fontSize: 13,
  },

  pillTextActive: {
    color: "#fff",
  },

  userListScroll: {
    maxHeight: 180,
  },

  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  userRowActive: {
    backgroundColor: "#f5f9ff",
  },

  userRowText: {
    color: "#333",
    fontSize: 14,
  },

  userRowTextActive: {
    color: "#4A90E2",
    fontWeight: "700",
  },

  filterPanelFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },

  resetText: {
    color: "#888",
    fontWeight: "600",
    fontSize: 14,
  },

  doneButton: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 16,
  },

  doneButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  totalCountRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 12,
    gap: 6,
  },

  totalCountText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "600",
  },
});