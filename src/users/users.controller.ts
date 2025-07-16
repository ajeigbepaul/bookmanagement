import {
  Controller,
  Get,
  UseGuards,
  Req,
  Param,
  Post,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { AuthenticatedRequest } from './authenticated-request.interface';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile returned.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Follow a user' })
  @ApiResponse({ status: 201, description: 'Followed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  async follow(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.usersService.follow(req.user.userId, id);
    return { message: 'Followed successfully' };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiResponse({ status: 200, description: 'Unfollowed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id/follow')
  async unfollow(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.usersService.unfollow(req.user.userId, id);
    return { message: 'Unfollowed successfully' };
  }

  @ApiOperation({ summary: 'Get followers of a user' })
  @ApiResponse({
    status: 200,
    description: 'List of followers returned.',
    type: [UserResponseDto],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id/followers')
  async getFollowers(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getFollowers(id);
  }

  @ApiOperation({ summary: 'Get users followed by a user' })
  @ApiResponse({
    status: 200,
    description: 'List of following users returned.',
    type: [UserResponseDto],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id/following')
  async getFollowing(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getFollowing(id);
  }
}
