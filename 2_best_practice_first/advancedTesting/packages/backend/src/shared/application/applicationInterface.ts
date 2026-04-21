import {UsersService} from "../../modules/users/usersService";
import {PostsService} from "../../modules/posts/postsService";
import {MarketingService} from "../../modules/marketing/marketingService";

export interface Application {
  users: UsersService;
  posts: PostsService;
  marketing: MarketingService;
}
