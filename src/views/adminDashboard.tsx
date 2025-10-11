import React from "react";
import View from "./view";
import { useNavigate } from "react-router-dom";
import NotFound from "./notFound";
import Button from "../components/button";
import Table from "../components/table";
import { pizzaService } from "../service/service";
import {
  Franchise,
  FranchiseList,
  Role,
  Store,
  User,
  UserList,
} from "../service/pizzaService";
import { TrashIcon } from "../icons";

interface Props {
  user: User | null;
}

export default function AdminDashboard(props: Props) {
  const navigate = useNavigate();

  const [userList, setUserList] = React.useState<UserList>({
    users: [],
    more: false,
  });
  const [franchiseList, setFranchiseList] = React.useState<FranchiseList>({
    franchises: [],
    more: false,
  });

  const [userPage, setUserPage] = React.useState(0);
  const [franchisePage, setFranchisePage] = React.useState(0);
  const [currentUserFilter, setCurrentUserFilter] = React.useState("*");
  const filterUserRef = React.useRef<HTMLInputElement>(null);
  const [currentFranchiseFilter, setCurrentFranchiseFilter] =
    React.useState("*");
  const filterFranchiseRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    (async () => {
      setFranchiseList(
        await pizzaService.getFranchises(
          franchisePage,
          3,
          `*${currentFranchiseFilter}*`
        )
      );
    })();
  }, [props.user, currentFranchiseFilter, franchisePage]);

  React.useEffect(() => {
    (async () => {
      setUserList(
        await pizzaService.listUsers(userPage, 10, `*${currentUserFilter}*`)
      );
    })();
  }, [props.user, currentUserFilter, userPage]);

  function createFranchise() {
    navigate("/admin-dashboard/create-franchise");
  }

  async function deleteUser(user: User) {
    navigate("/admin-dashboard/delete-user", {
      state: { user: user },
    });
  }

  async function closeFranchise(franchise: Franchise) {
    navigate("/admin-dashboard/close-franchise", {
      state: { franchise: franchise },
    });
  }

  async function closeStore(franchise: Franchise, store: Store) {
    navigate("/admin-dashboard/close-store", {
      state: { franchise: franchise, store: store },
    });
  }

  async function filterUsers(filterString: string) {
    setCurrentUserFilter(filterString);
  }

  async function filterFranchises(filterString: string) {
    setCurrentFranchiseFilter(filterString);
  }

  let response = <NotFound />;
  if (Role.isRole(props.user, Role.Admin)) {
    response = (
      <View title="Mama Ricci's kitchen">
        <Table
          title="Users"
          columns={[
            {
              key: "name",
              header: "Name",
              render: (user) => user.name,
            },
            {
              key: "email",
              header: "Email",
              render: (user) => user.email,
            },
            {
              key: "roles",
              header: "Roles",
              render: (user) => {
                return (
                  user.roles &&
                  user.roles.map((role, index) => (
                    <span key={index}>
                      {index === 0 ? "" : ", "} {role.role}
                    </span>
                  ))
                );
              },
            },
            {
              key: "action",
              header: "Action",
              render: (user) => (
                <button
                  type="button"
                  className="px-2 py-1 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-1 border-orange-400 text-orange-400 hover:border-orange-800 hover:text-orange-800"
                  onClick={() => deleteUser(user)}
                >
                  <TrashIcon />
                  Remove User
                </button>
              ),
              className:
                "px-6 py-1 whitespace-nowrap text-end text-sm font-medium",
            },
          ]}
          rows={userList.users.map((user) => ({ data: user }))}
          pagination={{
            currentPage: userPage,
            hasMore: userList.more,
            onPrevious: () => setUserPage(userPage - 1),
            onNext: () => setUserPage(userPage + 1),
          }}
          filter={{
            placeholder: "Filter users",
            onFilter: () => filterUsers(filterUserRef.current?.value || ""),
            filterRef: filterUserRef,
          }}
        />
        <Table
          title="Franchises"
          columns={[
            {
              key: "franchise",
              header: "Franchise",
              render: (franchise) => (
                <span className="text-l font-mono text-orange-600">
                  {franchise.name}
                </span>
              ),
              renderSubRow: () => null,
              className: "text-start px-2 whitespace-nowrap",
              subRowClassName:
                "text-end px-2 whitespace-nowrap text-sm text-gray-800",
            },
            {
              key: "franchisee",
              header: "Franchisee",
              render: (franchise) =>
                franchise.admins?.map((o) => o.name).join(", "),
              className:
                "text-start px-2 whitespace-nowrap text-sm font-normal text-gray-800",
              colSpan: 3,
              subRowColSpan: 1,
            },
            {
              key: "store",
              header: "Store",
              renderSubRow: (store) => store.name,
              colSpan: 0,
              subRowColSpan: 1,
              subRowClassName:
                "text-end px-2 whitespace-nowrap text-sm text-gray-800",
            },
            {
              key: "revenue",
              header: "Revenue",
              renderSubRow: (store) =>
                `${
                  store.totalRevenue ? store.totalRevenue.toLocaleString() : "0"
                } ₿`,
              colSpan: 0,
              subRowColSpan: 1,
              subRowClassName:
                "text-end px-2 whitespace-nowrap text-sm text-gray-800",
            },
            {
              key: "action",
              header: "Action",
              render: (franchise) => (
                <button
                  type="button"
                  className="px-2 py-1 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-1 border-orange-400 text-orange-400 hover:border-orange-800 hover:text-orange-800"
                  onClick={() => closeFranchise(franchise)}
                >
                  <TrashIcon />
                  Close
                </button>
              ),
              renderSubRow: (store) => (
                <button
                  type="button"
                  className="px-2 py-1 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-1 border-orange-400 text-orange-400 hover:border-orange-800 hover:text-orange-800"
                  onClick={() => closeStore(store.franchise, store)}
                >
                  <TrashIcon />
                  Close
                </button>
              ),
              className:
                "px-6 py-1 whitespace-nowrap text-end text-sm font-medium",
              subRowColSpan: 1,
            },
          ]}
          rows={franchiseList.franchises.map((franchise) => ({
            data: franchise,
            subRows: franchise.stores.map((store) => ({
              data: { ...store, franchise },
            })),
          }))}
          pagination={{
            currentPage: franchisePage,
            hasMore: franchiseList.more,
            onPrevious: () => setFranchisePage(franchisePage - 1),
            onNext: () => setFranchisePage(franchisePage + 1),
          }}
          filter={{
            placeholder: "Filter franchises",
            onFilter: () =>
              filterFranchises(filterFranchiseRef.current?.value || ""),
            filterRef: filterFranchiseRef,
          }}
        />
        <div>
          <Button
            className="w-36 text-xs sm:text-sm sm:w-64"
            title="Add Franchise"
            onPress={createFranchise}
          />
        </div>
      </View>
    );
  }

  return response;
}
