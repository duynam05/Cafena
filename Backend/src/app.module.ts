import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

// Configuration
import { configuration } from './config/configuration.js';

// Repositories
import {
  PrismaService,
  ProductRepository,
  UserRepository,
  CategoryRepository,
  OrderRepository,
  CartRepository,
  InventoryRepository,
} from './repositories/index.js';

// Services
import {
  AppService,
  ProductService,
  AuthService,
  MailService,
  UserService,
  CategoryService,
  CartService,
  OrderService,
  InventoryService,
  StatisticsService,
  AiRecommendationService,
} from './services/index.js';

// Controllers
import {
  AppController,
  ProductController,
  AuthController,
  UserController,
  CategoryController,
  CartController,
  OrderController,
  InventoryController,
  StatisticsController,
  AiRecommendationController,
} from './controllers/index.js';

// Guards & Strategies
import { JwtStrategy, JwtAuthGuard, RolesGuard } from './guards/index.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(
          'jwt.secret',
          'cafena_super_secret_jwt_key_2026_change_in_production',
        ),
        signOptions: {
          expiresIn: (configService.get<string>('jwt.expiresIn', '7d')) as any,
        },
      }),
    }),
    HttpModule,
  ],
  controllers: [
    AppController,
    ProductController,
    AuthController,
    UserController,
    CategoryController,
    CartController,
    OrderController,
    InventoryController,
    StatisticsController,
    AiRecommendationController,
  ],
  providers: [
    // Database & Repositories
    PrismaService,
    ProductRepository,
    UserRepository,
    CategoryRepository,
    OrderRepository,
    CartRepository,
    InventoryRepository,

    // Business Services
    AppService,
    ProductService,
    AuthService,
    MailService,
    UserService,
    CategoryService,
    CartService,
    OrderService,
    InventoryService,
    StatisticsService,
    AiRecommendationService,

    // Guards & Strategies
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [
    PrismaService,
    ProductRepository,
    UserRepository,
    CategoryRepository,
    OrderRepository,
    CartRepository,
    InventoryRepository,
  ],
})
export class AppModule {}
