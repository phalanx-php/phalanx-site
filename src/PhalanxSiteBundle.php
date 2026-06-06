<?php

declare(strict_types=1);

namespace Phalanx\Site;

use Phalanx\Boot\AppContext;
use Phalanx\Service\ServiceBundle;
use Phalanx\Service\Services;

final class PhalanxSiteBundle extends ServiceBundle
{
    public function services(Services $services, AppContext $context): void
    {
        $services->singleton(SiteConfig::class)
            ->factory(static fn(): SiteConfig => SiteConfig::fromContext($context));
    }
}
