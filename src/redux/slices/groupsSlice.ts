import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Group {
  id: string;
  name: string;
  category: string;
  avatarUrl: string;
  isJoined: boolean;
  membersCount: number;
}

interface GroupsState {
  list: Group[];
}

const initialGroups: Group[] = [
  {
    id: "group-1",
    name: "Figma Product Community",
    category: "Design & Systems",
    avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    isJoined: false,
    membersCount: 84200,
  },
  {
    id: "group-2",
    name: "Brain Health Association",
    category: "Neuroscience",
    avatarUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=150&auto=format&fit=crop&q=80",
    isJoined: true,
    membersCount: 12450,
  },
  {
    id: "group-3",
    name: "Clinical Psychologists BD",
    category: "Mental Health",
    avatarUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80",
    isJoined: false,
    membersCount: 5630,
  },
  {
    id: "group-4",
    name: "Cognitive Science Lab",
    category: "Research",
    avatarUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=150&auto=format&fit=crop&q=80",
    isJoined: false,
    membersCount: 2310,
  },
];

const initialState: GroupsState = {
  list: initialGroups,
};

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    toggleJoinGroup: (state, action: PayloadAction<string>) => {
      const group = state.list.find((g) => g.id === action.payload);
      if (group) {
        if (group.isJoined) {
          group.isJoined = false;
          group.membersCount -= 1;
        } else {
          group.isJoined = true;
          group.membersCount += 1;
        }
      }
    },
  },
});

export const { toggleJoinGroup } = groupsSlice.actions;
export default groupsSlice.reducer;
