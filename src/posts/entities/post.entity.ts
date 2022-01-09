import { Exclude } from 'class-transformer';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Category } from './category.entity';
import { Upload } from 'src/uploads/entities/upload.entity';
import { User } from '../../users/entities/user.entity';
@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'text', name: 'seo_title' })
  seoTitle: string;

  @Column({ nullable: true, type: 'text', name: 'seo_description' })
  seoDescription: string;

  @Column({ nullable: true, type: 'text', name: 'seo_keywords' })
  seoKeywords: string;

  @Column({ nullable: true, type: 'text', name: 'seo_canonical' })
  seoCanonical: string;

  @Column({ nullable: true, type: 'text', name: 'seo_image' })
  seoImage: string;

  @Column({ nullable: true, type: 'text', name: 'seo_json_ld' })
  seoJsonLd: string;

  @Column({ type: 'text', unique: true })
  name: string;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column({ type: 'boolean' })
  publish: boolean;

  @Exclude()
  @CreateDateColumn({
    name: 'create_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @Exclude()
  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;

  @ManyToMany(() => Category, (category) => category.posts)
  @JoinTable({
    name: 'posts_categories',
    joinColumn: {
      name: 'post_id',
    },
    inverseJoinColumn: {
      name: 'category_id',
    },
  }) // solo en un lado de la relación de muchos a muchos
  categories: Category[];

  @ManyToOne(() => Upload, (upload) => upload.categories)
  @JoinColumn({ name: 'image_id' })
  image: Upload;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
